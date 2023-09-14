import { Injectable } from "@nestjs/common";
import { CreateWishlistDto } from "./dto/create-wishlist.dto";
import { UpdateWishlistDto } from "./dto/update-wishlist.dto";
import { Wishlist } from "./entities/wishlist.entity";
import { InjectRepository } from "@nestjs/typeorm";
import {
  Repository,
  FindOptionsWhere,
  FindOneOptions,
  UpdateResult,
  DeleteResult,
} from "typeorm";
import { FindManyOptions } from "typeorm";

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    userId: string
  ): Promise<Wishlist> {
    const { itemsId, ...createWishlistData } = createWishlistDto;
    createWishlistData["items"] = [...itemsId];
    createWishlistData["owner"] = userId;
    return this.wishlistRepository.save(createWishlistData);
  }

  async findAll(paramsObject: FindManyOptions<Wishlist>): Promise<Wishlist[]> {
    return this.wishlistRepository.find(paramsObject);
  }

  async findOne(paramsObject: FindOneOptions<Wishlist>): Promise<Wishlist> {
    return this.wishlistRepository.findOne(paramsObject);
  }

  async updateOne(
    paramsObject: FindOptionsWhere<Wishlist>,
    updateUserDto: UpdateWishlistDto
  ): Promise<UpdateResult> {
    return this.wishlistRepository.update(paramsObject, updateUserDto);
  }

  async removeOne(
    paramsObject: FindOptionsWhere<Wishlist>
  ): Promise<DeleteResult> {
    return this.wishlistRepository.delete(paramsObject);
  }
}
