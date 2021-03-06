import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MailerOptions } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';

export interface Configuration {
  // development or anything else
  nodeEnv: string;
  appName: string;
  webUrl: string;
  auth: {
    // Access token lifetime, expressed in seconds
    // or a string describing a time span:
    // [zeit/ms](https://github.com/zeit/ms.js).
    // Eg: 60, "2 days", "10h", "7d"
    accessTokenLifetime: string | number;
    resetPasswordTokenLifetime: string | number;
    // secret to generate token
    secret: string;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
    region: string;
    s3Prefix: string;
    s3Endpoint: string;
  };
  typeorm: TypeOrmModuleOptions;
  mail: MailerOptions;
}

export const configFactory = (): Configuration => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  appName: 'Notebook',
  webUrl: process.env.WEB_URL || 'http://localhost:3001',
  auth: {
    accessTokenLifetime: '7d',
    secret: '19001560',
    resetPasswordTokenLifetime: '15m',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    bucket: process.env.AWS_BUCKET || '',
    region: process.env.AWS_DEFAULT_REGION || '',
    s3Prefix: 'upload/',
    s3Endpoint: process.env.AWS_S3_ENDPOINT || '',
  },
  typeorm: {
    type: 'mongodb',
    url: process.env.DB_URI || 'mongodb://localhost:27017/notebook',
    useUnifiedTopology: true,
    autoLoadEntities: true,
    authSource: 'admin',
  },
  mail: {
    transport: {
      host: process.env.SMTP_HOST || 'localhost',
      port: (process.env.SMTP_PORT && parseInt(process.env.SMTP_PORT, 10)) || 1025,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PWD || '',
          }
        : undefined,
    },
    defaults: {
      from: `Notebook <support@${process.env.MAIL_DOMAIN}>`,
    },
    template: {
      adapter: new EjsAdapter(),
      dir: `${__dirname}/assets/email-templates`,
      options: {
        strict: false,
      },
    },
  },
});

export default configFactory;
