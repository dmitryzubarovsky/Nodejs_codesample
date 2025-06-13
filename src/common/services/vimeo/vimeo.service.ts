import { Vimeo } from 'vimeo';
import { BadGatewayException, Inject } from '@nestjs/common';

import { CONFIG_PROVIDER_TOKEN, VimeoResponse } from '../types';
import { AppConfigService } from '../config/app-config.service';
import { AxiosService } from '../axios/axios.service';
import { vimeoApiUrl } from '../../constants';

export class VimeoService {
  private readonly vimeoClient: Vimeo;
  private readonly headers = {
    'Authorization': `Bearer ${this.configService.vimeoConfig.accessToken}`,
    'Content-Type': 'application/json',
  };

  constructor(
    @Inject(CONFIG_PROVIDER_TOKEN)
    private readonly configService: AppConfigService
  ) {
    this.vimeoClient = new Vimeo(
      this.configService.vimeoConfig.clientId,
      this.configService.vimeoConfig.clientSecret,
      this.configService.vimeoConfig.accessToken
    );
  }

  getVideo(vimeoId: string): Promise<VimeoResponse> {
    return new Promise((resolve, reject) => {
      this.vimeoClient.request(`/videos/${vimeoId}`, (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      });
    });
  }

  uploadVideo(path: string, name: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.vimeoClient.upload(path, { name, },
        (url) => {
          resolve(url);
        },
        undefined,
        (error) => {
          reject(error);
        });
    });
  }

  async deleteVideo(id: number | string): Promise<void> {
    const request = new AxiosService(`${vimeoApiUrl}${id}`, this.headers);
    try {
      await request.delete();
    } catch (e) {
      throw new BadGatewayException(e.message);
    }
  }
}
