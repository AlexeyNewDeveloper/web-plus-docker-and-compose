import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  BadRequestException,
} from "@nestjs/common";
import { OffersService } from "./offers.service";
import { CreateOfferDto } from "./dto/create-offer.dto";
import { JwtAuthGuard } from "src/auth/strategies/jwt/jwt-auth.guard";
import { WishesService } from "src/wishes/wishes.service";
import { Offer } from "./entities/offer.entity";

@Controller("offers")
@UseGuards(JwtAuthGuard)
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly wishesService: WishesService
  ) {}

  @Post()
  async create(
    @Request() req,
    @Body() createOfferDto: CreateOfferDto
  ): Promise<Offer> {
    const wish = await this.wishesService.findOne({
      where: {
        id: createOfferDto.itemId,
      },
      relations: {
        owner: true,
        offers: {
          user: true,
        },
      },
    });

    const finalAmount = Number(wish.raised) + Number(createOfferDto.amount);

    if (finalAmount > Number(wish.price)) {
      throw new BadRequestException("Сумма оффера превышает цену товара.");
    }

    if (req.user.id !== wish.owner.id) {
      const offer = await this.offersService.create(
        createOfferDto,
        req.user.id
      );
      await this.wishesService.getRaise(
        +createOfferDto.amount,
        createOfferDto.itemId
      );

      return offer;
    } else {
      throw new BadRequestException(
        "Вы не можете скидываться на свои же подарки"
      );
    }
  }

  @Get()
  async findAll(@Request() req): Promise<Offer[]> {
    return this.offersService.findAll({
      where: {
        user: req.user.id,
      },
    });
  }

  @Get(":id")
  findOne(@Param("id") id: string): Promise<Offer> {
    return this.offersService.findOne(+id);
  }
}
