import { Entity, Column, OneToMany } from "typeorm";
import { Length, IsString, IsUrl, IsEmail, IsArray } from "class-validator";
import { BaseEntity } from "src/base-entities/base-entity";
import { ABOUT_DEFAULT_TEXT, AVATAR_DEFAULT_LINK } from "src/utils/constants";
import { Wish } from "src/wishes/entities/wish.entity";
import { Offer } from "src/offers/entities/offer.entity";
import { Wishlist } from "src/wishlists/entities/wishlist.entity";

@Entity()
export class User extends BaseEntity {
  @IsString()
  @Length(2, 30)
  @Column({
    type: "varchar",
    length: 30,
    unique: true,
  })
  username: string;

  @IsString()
  @Length(2, 200)
  @Column({
    type: "varchar",
    length: 200,
    default: ABOUT_DEFAULT_TEXT,
  })
  about: string;

  @IsUrl()
  @IsString()
  @Column({
    type: "text",
    default: AVATAR_DEFAULT_LINK,
  })
  avatar: string;

  @IsEmail()
  @IsString()
  @Column({
    unique: true,
  })
  email: string;

  @IsString()
  @Column()
  password: string;

  @IsArray()
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @OneToMany(() => Wish, (wish) => wish.owner)
  @IsArray()
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  @IsArray()
  offers: Offer[];
}
