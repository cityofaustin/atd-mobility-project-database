export default {
  user: {
    timezoneOffset: new Date().getTimezoneOffset(),
  },
  env: {
    APP_CLOUDFRONT: process.env.REACT_APP_AWS_CLOUDFRONT,
    APP_ENVIRONMENT: process.env.REACT_APP_HASURA_ENV,
    APP_HASURA_ENDPOINT: process.env.REACT_APP_HASURA_ENDPOINT,
    APP_API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT,
  },
  cognito: {
    APP_CLIENT_ID: process.env.REACT_APP_AWS_COGNITO_APP_CLIENT_ID,
    DOMAIN: process.env.REACT_APP_AWS_COGNITO_DOMAIN,
    REDIRECT_SIGN_IN: process.env.REACT_APP_AWS_COGNITO_REDIRECT_SIGN_IN,
    REDIRECT_SIGN_OUT: process.env.REACT_APP_AWS_COGNITO_REDIRECT_SIGN_OUT,
    REGION: process.env.REACT_APP_AWS_COGNITO_REGION,
    USER_POOL_ID: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
  },
};
