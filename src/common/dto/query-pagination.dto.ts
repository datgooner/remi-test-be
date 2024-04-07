import { Type } from "class-transformer";
import { IsNumber, Max, Min } from "class-validator";

export class QueryPaginationDto {
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Type(() => Number)
  skip?: number = 0;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @Type(() => Number)
  @Min(1, { message: "Limit per page must be greater than or equal 1" })
  @Max(100, { message: "Limit per page must be lower than or equal 100" })
  limit?: number = 10;
}
