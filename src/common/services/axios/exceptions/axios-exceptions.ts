export class ClientErrorException extends Error {
  constructor(public statusCode: number, message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export class ServerErrorException extends Error {
  constructor(public statusCode: number, message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export class RedirectionException extends Error {
  constructor(public statusCode: number, message: string) {
    super(`${statusCode}: ${message}`);
  }
}

export class InvalidResponseException extends Error {
  constructor() {
    super('Response is not valid json');
  }
}

export class UnknownErrorException extends Error {
  constructor() {
    super('Unknown error');
  }
}
