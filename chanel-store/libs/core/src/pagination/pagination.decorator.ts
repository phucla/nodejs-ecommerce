// Standard library
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

// Internal
import { CsPaginationResultDto } from './pagination.dto';

/**
 * Define pagination decorator
 * @param model
 */
export const CsPaginationResponse = <T extends Type<any>>(model: T) =>
  applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          {
            $ref: getSchemaPath(CsPaginationResultDto),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
