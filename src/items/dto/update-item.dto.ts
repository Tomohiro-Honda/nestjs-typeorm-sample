import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsString, MaxLength, IsInt, Min, MinLength } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

export class UpdateItemDto extends PartialType(CreateItemDto) {
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  name: string;

  @IsInt()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsString()
  description: string;
}
