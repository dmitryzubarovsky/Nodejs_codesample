import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import {
  REDIRECTION_ERROR_STATUS_CODES,
  SERVER_ERROR_STATUS_CODES,
  CLIENT_ERROR_STATUS_CODES,
  NO_CONTENT_ERROR_STATUS_CODES
} from './constants';
import {
  InvalidResponseException,
  UnknownErrorException,
  ClientErrorException,
  RedirectionException,
  ServerErrorException
} from './exceptions';

export class AxiosService {
  constructor(
    private readonly url: string,
    private readonly headers?: Record<string, string>
  ) {}

  async post<T>(body: AxiosRequestConfig): Promise<T> {
    const response = await axios(this.url, {
      method: 'POST',
      data: JSON.stringify(body),
      headers: this.headers,
    });
    return this.validateResponse<T>(response);
  }

  async get<T>(query?: Record<string, string>): Promise<T> {
    const url = this.createQueryString(query);
    const response = await axios(url, {
      method: 'GET',
      headers: this.headers,
    });
    return this.validateResponse<T>(response);
  }

  async put<T>(query: Record<string, string>, body: AxiosRequestConfig): Promise<T> {
    const url = this.createQueryString(query);
    const response = await axios(url, {
      method: 'PUT',
      data: JSON.stringify(body),
      headers: this.headers,
    });
    return this.validateResponse<T>(response);
  }

  async delete<T>(query?: Record<string, string>): Promise<T> {
    const url = this.createQueryString(query);
    const response = await axios(url, {
      method: 'DELETE',
      headers: this.headers,
    });
    return this.validateResponse<T>(response);
  }

  async patch<T>(body: AxiosRequestConfig): Promise<T> {
    const response = await axios(this.url, {
      method: 'PATCH',
      data: JSON.stringify(body),
      headers: this.headers,
    });
    return this.validateResponse<T>(response);
  }

  private createQueryString(query?: Record<string, string>): string {
    const url = new URL(this.url);
    if (query) {
      Object.keys(query).forEach(param =>
        url.searchParams.append(param, query[param]));
    }
    return url.toString();
  }

  private async validateResponse<R>(response: AxiosResponse): Promise<R> {
    if (response.status === NO_CONTENT_ERROR_STATUS_CODES) {
      return null;
    }
    if (response) {
      const responseJson = await response.data() as R;
      if (typeof responseJson === 'object') {
        return responseJson;
      }
      throw new InvalidResponseException();
    }
    const { status, statusText, } = response;
    if (status >= SERVER_ERROR_STATUS_CODES) {
      throw new ServerErrorException(status, statusText);
    } else if (status >= CLIENT_ERROR_STATUS_CODES) {
      throw new ClientErrorException(status, statusText);
    } else if (status > REDIRECTION_ERROR_STATUS_CODES) {
      throw new RedirectionException(status, statusText);
    }
    throw new UnknownErrorException();
  }
}
