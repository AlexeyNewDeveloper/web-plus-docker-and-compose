import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UsersModule } from "src/users/users.module";
import { PassportModule } from "@nestjs/passport/dist";
import { LocalStrategy } from "./strategies/local/local.strategy";
import { JwtStrategy } from "./strategies/jwt/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { JWT_SECRET } from "src/utils/constants";
import { HashModule } from "src/hash/hash.module";
import { HashService } from "src/hash/hash.service";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/users/entities/user.entity";
import { AuthController } from "./auth.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule,
    PassportModule,
    HashModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: "600s" },
    }),
  ],
  providers: [
    HashService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    UsersService,
    JwtService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
