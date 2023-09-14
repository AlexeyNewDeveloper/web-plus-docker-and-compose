import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { UserProfileResponseDto } from "./dto/user-profile-response.dto";
import { FindOneOptions, FindManyOptions } from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    return this.userRepository.save(createUserDto);
  }

  async findAll(
    paramsObject: FindManyOptions<User>
  ): Promise<UserProfileResponseDto[]> {
    return this.userRepository.find(paramsObject);
  }

  async findOne(paramsObject: FindOneOptions<User>): Promise<User> {
    return this.userRepository.findOne(paramsObject);
  }

  async updateOne(
    id: number,
    updateUserDto: UpdateUserDto
  ): Promise<UserProfileResponseDto> {
    // const updateResult = await this.userRepository.update(id, updateUserDto);

    const updateResult = await this.userRepository
      .createQueryBuilder()
      .update(User, updateUserDto)
      .where({ id })
      .returning([
        "id",
        "createdAt",
        "updatedAt",
        "username",
        "about",
        "avatar",
        "email",
      ])
      .execute();
    return updateResult.raw[0];
  }

  async removeOne(id: number) {
    return this.userRepository.delete(id);
  }
}
