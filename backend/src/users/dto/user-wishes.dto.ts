import {
  IsString,
  Length,
  IsUrl,
  IsNumber,
  Min,
  IsArray,
  IsDate,
} from "class-validator";
import { Offer } from "src/offers/entities/offer.entity";

export class UserWishesDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  @Length(1, 250)
  name: string;

  @IsUrl()
  @IsString()
  link: string;

  @IsUrl()
  @IsString()
  image: string;

  @IsNumber()
  @Min(1)
  price: number;

  @IsNumber()
  @Min(1)
  raised: number;

  @IsString()
  @Length(1, 1024)
  description: string;

  @IsArray()
  offers: Offer[];

  @IsNumber()
  copied: number;
}
