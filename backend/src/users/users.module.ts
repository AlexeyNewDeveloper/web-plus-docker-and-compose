import { Module } from "@nestjs/common";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { HashModule } from "src/hash/hash.module";
import { HashService } from "src/hash/hash.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { WishesService } from "src/wishes/wishes.service";
import { Wish } from "src/wishes/entities/wish.entity";

@Module({
  imports: [HashModule, TypeOrmModule.forFeature([User, Wish])],
  controllers: [UsersController],
  providers: [UsersService, HashService, WishesService],
  exports: [UsersService],
})
export class UsersModule {}
