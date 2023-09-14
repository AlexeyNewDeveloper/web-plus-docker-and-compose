import { IsBoolean, IsNumber, Min } from "class-validator";

export class CreateOfferDto {
  @IsNumber()
  itemId: number;

  @Min(1)
  @IsNumber()
  amount: number;

  @IsBoolean()
  hidden: boolean;
}
