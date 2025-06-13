import { EnvironmentName } from '../../enums';

const envVarNames: Record<'generic' | EnvironmentName, Array<string>> = {
  generic: [
    'BASE_FRONTEND_URL',
    'BASE_API_URL',
    'PORT',
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_NAME',
    'S3_ACCESS_KEY',
    'S3_SECRET_KEY',
    'BUCKET_IMAGE_NAME',
    'HOTTOK',
    'VIMEO_CLIENT_ID',
    'VIMEO_CLIENT_SECRET',
    'VIMEO_ACCESS_TOKEN',
    'PROMO_LANDING_URL',
    'SET_PASSWORD_URL',
    'RESET_PASSWORD_URL',
    'REGISTRATION_URL',
    'GROUP_INVITATION_URL',
    'GROUP_BASE_URL',
    'CHANGE_EMAIL_URL',
    'CONFIRM_CHANGE_EMAIL_URL',
    'ENCRYPTION_KEY',
    'STRIPE_REFRESH_URL',
    'STRIPE_PK',
    'STRIPE_SK',
    'STRIPE_WEBHOOK_SECRET',
    'STRIPE_FEE',
    'LOGGLY_TOKEN',
    'LOGGLY_SUBDOMAIN',
    'LOGGLY_USERNAME',
    'LOGGLY_PASSWORD',
    'MAIL_RECIPIENT',
    'MAIL_HOST',
    'MAIL_PORT',
    'MAIL_AUTH_USER',
    'MAIL_AUTH_PASS',
    'STANDARD_PRICE',
  ],
  local: [],
  dev: [],
  stage: [],
  prod: [],
};

function checker(names: Array<string>): void {
  names.forEach(name => {
    if (!process.env[name]) {
      throw new Error('Invalid ' + name);
    }
  });
}

export function validateEnv(env: EnvironmentName): void {
  checker(envVarNames.generic);
  checker(envVarNames[env]);
}
