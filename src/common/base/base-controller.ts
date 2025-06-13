import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse
} from '@nestjs/swagger';
import { BaseErrorResponseDTO, BadRequestDTO } from './base-dto';

@ApiBadRequestResponse({ description: 'Error in request data', type: BadRequestDTO, })
@ApiUnauthorizedResponse({ description: 'User is not authorized', type: BaseErrorResponseDTO, })
@ApiNotFoundResponse({ description: 'Entity with this id was not found', type: BaseErrorResponseDTO, })
@ApiForbiddenResponse({ description: 'The user with this id does not have sufficient permissions', type: BaseErrorResponseDTO, })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error', type: BaseErrorResponseDTO, })
export class BaseController {}
