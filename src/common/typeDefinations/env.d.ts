namespace NodeJS {
  interface ProcessEnv {
    //* application
    PORT: number;
    //* Database
    DB_PORT: number;
    DB_NAME: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    //*S3
    S3_SECRET_KEY: string;
    S3_ACCESS_KEY: string;
    S3_BUCKET_NAME: string;
    s3_ENDPOINT: string;
    //* JWT
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;

    //* Zarinnpal
    ZARINNPAL_VERIFY_URL: string;
    ZARINNPAL_REQUEST_URL: string;
    ZARINNPAL_MERCHANT_ID: string;
    ZARINNPAL_GETWAY_URL: string;
    ZARINNPAL_CALLBACK_URL: string;
  }
}
