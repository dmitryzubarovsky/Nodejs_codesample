export enum LogLevel {
  LOG = 'LOG',
  DEBUG = 'DEBUG',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export enum EnvironmentName {
  LOCAL = 'local',
  DEV = 'dev',
  STAGE = 'stage',
  PROD = 'prod',
}

export enum KeyTemplate {
  IMAGE = 'image/{{storage}}/{{id}}',
  ATTACHMENT = 'attachment/{{storage}}/{{id}}',
  INVOICES = 'invoices/{{storage}}/{{id}}',
  DOCUMENTS = 'documents/{{storage}}/{{id}}',
}
