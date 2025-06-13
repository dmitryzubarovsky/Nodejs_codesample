import { MetadataConfig } from '../types';

export class RequestMetadata {
  private constructor() { }

  private requestMetadata: MetadataConfig;

  private static instance: RequestMetadata;

  static getInstance(): RequestMetadata {
    if (!RequestMetadata.instance) {
      RequestMetadata.instance = new RequestMetadata();
    }

    return RequestMetadata.instance;
  }

  set metadata(value: MetadataConfig) {
    this.requestMetadata = value;
  }

  get metadata(): MetadataConfig {
    return this.requestMetadata;
  }
}
