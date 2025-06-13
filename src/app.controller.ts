import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiProperty, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

class HealthcheckDTO {
  @ApiProperty()
  ping: 'PONG';
}

@Controller()
@ApiTags('healthcheck')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOkResponse({ description: 'Returns healthcheck status', type: HealthcheckDTO, })
  @Get('ping')
  getHello(): HealthcheckDTO {
    return { ping: 'PONG', };
  }
}
