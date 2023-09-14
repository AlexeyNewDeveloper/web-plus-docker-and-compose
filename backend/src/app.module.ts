import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersModule } from "./users/users.module";
import { WishesModule } from "./wishes/wishes.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { OffersModule } from "./offers/offers.module";
import { User } from "./users/entities/user.entity";
import { Wish } from "./wishes/entities/wish.entity";
import { Wishlist } from "./wishlists/entities/wishlist.entity";
import { Offer } from "./offers/entities/offer.entity";
import { AuthModule } from "./auth/auth.module";
import { HashModule } from "./hash/hash.module";
import { JwtService } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: "../.env",
      // envFilePath: ".env",
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres" as const,
        host: configService.get<string>("POSTGRES_HOST"),
        port: parseInt(configService.get<string>("DATABASE_PORT")),
        username: configService.get<string>("POSTGRES_USER"),
        password: configService.get<string>("POSTGRES_PASSWORD"),
        database: configService.get<string>("POSTGRES_DB"),
        entities: [User, Wish, Wishlist, Offer],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    HashModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, JwtService],
})
// eslint-disable-next-line prettier/prettier
export class AppModule { }

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: "postgres",
//       host: "localhost",
//       port: 5432,
//       username: "student",
//       password: "student",
//       database: "kupipodariday_project",
//       entities: [User, Wish, Wishlist, Offer],
//       synchronize: true,
//       retryAttempts: 3,
//     }),
//     UsersModule,
//     WishesModule,
//     WishlistsModule,
//     OffersModule,
//     HashModule,
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService, JwtService],
// })
// // eslint-disable-next-line prettier/prettier
// export class AppModule { }
