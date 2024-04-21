import { ApiProperty } from '@nestjs/swagger';

export class UnauthorizedResponseDto {
  @ApiProperty({
    example: 'Invalid API key',
    description: 'string',
  })
  message: string;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Unauthorized',
  })
  error: string;

  @ApiProperty({ example: '401', description: 'Unauthorized' })
  statusCode: number;
}

export class BadRequestResponseDto {
  @ApiProperty({
    description: 'bad request when send a wrong data',
  })
  message: string;

  @ApiProperty({
    description: 'badRequest',
  })
  error: string;

  @ApiProperty({ example: '400', description: 'BadRequest' })
  statusCode: number;
}
