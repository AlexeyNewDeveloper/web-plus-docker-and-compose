import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from "@nestjs/common";
import { WishesService } from "./wishes.service";
import { CreateWishDto } from "./dto/create-wish.dto";
import { UpdateWishDto } from "./dto/update-wish.dto";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";
import { Wish } from "./entities/wish.entity";
import { DeleteResult, UpdateResult } from "typeorm";

@Controller("wishes")
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Request() req,
    @Body() createWishDto: CreateWishDto
  ): Promise<Wish> {
    const createdWish = await this.wishesService.create({
      owner: req.user.id,
      ...createWishDto,
    });
    return createdWish;
  }

  @Get("last")
  findLast(): Promise<Wish[]> {
    return this.wishesService.findAll({
      order: {
        createdAt: "DESC",
      },
      skip: 0,
      take: 40,
    });
  }

  @Get("top")
  findTop(): Promise<Wish[]> {
    return this.wishesService.findAll({
      order: {
        copied: "DESC",
      },
      skip: 0,
      take: 20,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  async getWish(
    @Param("id") id: string
  ): Promise<Omit<Wish, "offers"> & { offers: Record<string, any>[] }> {
    const wish = await this.wishesService.findOne({
      where: { id: +id },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    const listOfUsersWithOffers = wish.offers.map((item) => {
      let user = {};

      user = { ...item, name: item.user.username };
      return user;
    });

    return { ...wish, offers: listOfUsersWithOffers };
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  async updateWish(
    @Request() req,
    @Param("id") id: string,
    @Body() updateWishDto: UpdateWishDto
  ): Promise<UpdateResult> {
    return this.wishesService.updateOne(
      { id: +id, owner: req.user.id, offers: [] },
      updateWishDto
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async remove(@Request() req, @Param("id") id: string): Promise<DeleteResult> {
    return this.wishesService.removeOne({ id: +id, owner: req.user });
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/copy")
  async copyWish(@Request() req, @Param("id") id: string): Promise<Wish> {
    const wish = await this.wishesService.findOne({
      where: { id: +id },
      select: {
        name: true,
        link: true,
        image: true,
        price: true,
        description: true,
      },
    });
    const copiedWish = await this.wishesService.create({
      owner: req.user.id,
      ...wish,
    });
    this.wishesService.incrementCopiedField(+id, 1);
    return copiedWish;
    // this.wishesService.updateOne({ id: +id }, {copied: })
  }
}
