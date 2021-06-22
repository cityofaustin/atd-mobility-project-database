#!/usr/bin/env bash

#
# Determine working stage based on branch name
#
case "${BRANCH_NAME}" in
  "production")
    export WORKING_STAGE="production";
  ;;
  "staging")
    export WORKING_STAGE="staging";
  ;;
  *)
    export WORKING_STAGE="moped-test";
  ;;
esac

#
# Override the working stage if this is a moped-test build.
#
if [[ "${MOPED_TEST_STAGE}" = "TRUE" ]]; then
  export WORKING_STAGE="test";
  export BUILD_TYPE="moped-test";
else
  export BUILD_TYPE="git push";
fi;

echo "BUILD_TYPE: ${BUILD_TYPE}";
echo "SOURCE -> BRANCH_NAME: ${BRANCH_NAME}";
echo "SOURCE -> WORKING_STAGE: ${WORKING_STAGE}";
echo "PR_NUMBER: '${PR_NUMBER}'";

#
# First, we need to create the python package by installing requirements
#
function install_requirements {
  echo "Installing AWS's CLI";
  pip install awscli;
  echo "Installing requirements...";
  pip install -r ./requirements.txt --target ./package;
}

#
# Secondly, we must bundle the package and python script into a single zip file bundle
#
function bundle_function {
  echo "Bundling function...";
  cd package;
  zip -r9 ../function.zip .;
  cd ${OLDPWD};
  zip -g function.zip *.py -x "venv/*" "tests/*" "events/*" ".pytest_cache/*" "__pycache__/*" "*.txt" "*.md";
}

#
# Generates environment variables for deployment
#
function generate_env_vars {
  FUNCTION_NAME_CONFIG=$1
  echo "Generating Environment Variables for SQS";
  aws secretsmanager get-secret-value \
  --secret-id "ATD_MOPED_EVENT_SQS_ENV_${WORKING_STAGE^^}" | \
  jq -rc ".SecretString" > handler_config.json;

  # Replaces the %FUNCTION_NAME% string in the template
  sed -i "s/%FUNCTION_NAME%/${FUNCTION_NAME_CONFIG}/g" handler_config.json;
}

#
# Deploys a single function
#
function deploy_lambda_function {
  FUNCTION_NAME=$1
  echo "Deploying function: ${FUNCTION_NAME} @ ${PWD}";
  # Create or update function
  { # try
    echo "Creating lambda function ${FUNCTION_NAME} @ ${PWD}";
    aws lambda create-function \
        --role $ATD_MOPED_EVENTS_ROLE \
        --handler "app.handler" \
        --tags "project=atd-moped,environment=${WORKING_STAGE}" \
        --runtime python3.8 \
        --function-name "${FUNCTION_NAME}" \
        --zip-file fileb://$PWD/function.zip > /dev/null;
  } || { # catch: update
    echo -e "\n\nUpdating lambda function ${FUNCTION_NAME} @ ${PWD}";
    aws lambda update-function-code \
        --function-name "${FUNCTION_NAME}" \
        --zip-file fileb://$PWD/function.zip > /dev/null;
  }
  echo "Current directory: ";
  # Set concurrency to maximum allowed: 5
  echo "Setting concurrency for ${FUNCTION_NAME} @ ${PWD}";
  aws lambda put-function-concurrency \
        --function-name "${FUNCTION_NAME}" \
        --reserved-concurrent-executions 5;
  # Set environment variables for the function
  echo "Resetting environment variables: ${FUNCTION_NAME} @ ${PWD}";
  aws lambda update-function-configuration \
        --function-name "${FUNCTION_NAME}" \
        --cli-input-json file://$PWD/handler_config.json | jq -r ".LastModified";
  echo "Finished Lambda Update/Deployment";
}

#
# Deploy Event Source Mapping
#
function deploy_event_source_mapping {
    FUNCTION_NAME=$1
    EVENT_SOURCE_ARN=$2
    MAPPINGS_COUNT=$(aws lambda list-event-source-mappings --function-name "${FUNCTION_NAME}" | jq -r ".EventSourceMappings | length");

    # If no mappings are found, then create it...
    if [[ "${MAPPINGS_COUNT}" = "0" ]]; then
        echo "Deploying event source mapping '${FUNCTION_NAME}' @ '${EVENT_SOURCE_ARN}'";
        aws lambda create-event-source-mapping --function-name "${FUNCTION_NAME}"  \
            --batch-size 10 --event-source-arn "${EVENT_SOURCE_ARN}";

    # If there is one or more, then ignore, chances are it already exists.
    else
        echo "Skipping, the mapping already exists";
    fi;
}

#
# Deploys an SQS Queue
#
function deploy_sqs {
    QUEUE_NAME=$1
    echo "Deploying queue '${QUEUE_NAME}'";
    {
        QUEUE_URL=$(aws sqs get-queue-url --queue-name "${QUEUE_NAME}" 2>/dev/null | jq -r ".QueueUrl");
        echo "The queue already exists: '${QUEUE_URL}'";
    } || {
        QUEUE_URL="";
        echo "The queue does not exist, creating: '${QUEUE_NAME}'";
    }

    # If the queue url is empty, it means it does not exist. We must create it.
    if [[ "${QUEUE_URL}" = "" ]]; then
        # Create with default values, no re-drive policy.
        echo "Creating Queue";
        CREATE_SQS=$(aws sqs create-queue --queue-name "${QUEUE_NAME}" --attributes "DelaySeconds=0,MaximumMessageSize=262144,MessageRetentionPeriod=345600,VisibilityTimeout=30,RedrivePolicy='{\"deadLetterTargetArn\":\"arn:aws:sqs:us-east-1:295525487728:atd_vz_deadletter_queue\",\"maxReceiveCount\":3}'" 2> /dev/null);
        QUEUE_URL=$(aws sqs get-queue-url --queue-name "${QUEUE_NAME}" 2>/dev/null | jq -r ".QueueUrl");
        echo "Done creating queue: QUEUE_URL: ${QUEUE_URL}";
    else
        echo "Skipping SQS creation, the queue already exists: ${QUEUE_NAME}";
    fi;

    # Gather SQS attributes from URL, extract amazon resource name
    QUEUE_ARN=$(aws sqs get-queue-attributes --queue-url "${QUEUE_URL}" --attribute-names "QueueArn" 2>/dev/null | jq -r ".Attributes.QueueArn");
    echo "QUEUE_ARN: ${QUEUE_ARN}";
    echo "QUEUE_URL: ${QUEUE_URL}";

    # Create event-source mapping
    echo "Creating event-source mapping between function ${QUEUE_NAME} and queue ARN: ${QUEUE_ARN}";
    deploy_event_source_mapping $QUEUE_NAME $QUEUE_ARN;
}

#
# Builds & Deploys Event Function
#
function deploy_event_function {
  MAIN_DIR=$PWD
  FUNCTION_NAME_MIN=$1
  FUNCTION_NAME_AWS="atd-moped-events-${FUNCTION_NAME_MIN}_${WORKING_STAGE}";
  FUNCTION_DIR="${MAIN_DIR}/moped-data-events/${FUNCTION_NAME_MIN}";

  echo "Current directory: ${PWD}";
  echo "Building function '${FUNCTION_NAME_AWS}' @ path: '${FUNCTION_DIR}'";
  echo "Entering Directory: ${FUNCTION_DIR}";
  cd $FUNCTION_DIR;

  install_requirements;
  bundle_function;
  generate_env_vars "${FUNCTION_NAME_MIN}";
  deploy_lambda_function "${FUNCTION_NAME_AWS}";
  deploy_sqs "${FUNCTION_NAME_AWS}";
  cd $MAIN_DIR;
  echo "Exit, current path: ${PWD}";
}
