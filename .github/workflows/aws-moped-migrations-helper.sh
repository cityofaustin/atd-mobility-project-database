#!/usr/bin/env bash

case "${BRANCH_NAME}" in
"production")
  export WORKING_STAGE="production"
  ;;
*)
  export WORKING_STAGE="staging"
  ;;
esac

echo "SOURCE -> BRANCH_NAME: ${BRANCH_NAME}"
echo "SOURCE -> WORKING_STAGE: ${WORKING_STAGE}"

#
# Download the Zappa settings from the AWS Secrets Manager
#
function download_hasura_settings() {
  echo "Downloading Hasura Settings: ${WORKING_STAGE}";

  if [[ "${WORKING_STAGE}" == "production" ]]; then
    export AWS_HASURA_CONFIGURATION="${AWS_MOPED_HASURA_CONFIGURAITON_FILE_PRODUCTION}";
  else
    export AWS_HASURA_CONFIGURATION="${AWS_MOPED_HASURA_CONFIGURAITON_FILE_STAGING}";
  fi;

  aws secretsmanager get-secret-value \
  --secret-id "${AWS_HASURA_CONFIGURATION}" | \
  jq -rc ".SecretString" > config.yaml;
}


#
# Waits until the local hasura server is ready
#
function run_migration() {
  echo "----- MIGRATIONS STARTED -----";
  hasura version;
  echo "Migration Endpoint";
  head -n 2 ./config.yaml;
  echo "Applying migration";
#  hasura migrate apply;
  echo "Applying metadata";
#  hasura metadata apply;
  echo "----- MIGRATIONS FINISHED -----";
}

#
# Controls the migration process
#
function run_migration_process() {
  download_hasura_settings;
  run_migration;
}
