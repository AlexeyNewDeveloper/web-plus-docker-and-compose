import { IsArray } from "class-validator";
import { Wish } from "src/wishes/entities/wish.entity";

export class UserWishesResponseDto {
  @IsArray()
  wishes: Wish[];
}
