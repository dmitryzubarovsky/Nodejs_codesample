import { EmailTypeEnum } from '../../common/enums';

export type Send = {
  email: string;
  type: EmailTypeEnum;
  handlebars: Array<string| number>;
};

export type SendEmail = {
  type: EmailTypeEnum;
  email: string;
  handlebars: Array<string| number>;
  mailToken?: string;
};
