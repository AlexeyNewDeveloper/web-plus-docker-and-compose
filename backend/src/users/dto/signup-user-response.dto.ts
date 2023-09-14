import {
  IsString,
  Length,
  IsUrl,
  IsEmail,
  IsDate,
  IsNumber,
} from "class-validator";

export class SignupUserResponseDto {
  @IsNumber()
  id: number;

  @IsDate()
  createdAt: Date;

  @IsDate()
  updatedAt: Date;

  @IsString()
  @Length(2, 30)
  username: string;

  @IsString()
  @Length(2, 200)
  about: string;

  @IsUrl()
  @IsString()
  avatar: string;

  @IsEmail()
  @IsString()
  email: string;
}
