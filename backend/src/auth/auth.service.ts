import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from "@nestjs/common";
import { UsersService } from "src/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { HashService } from "src/hash/hash.service";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { JWT_SECRET } from "src/utils/constants";
import { User } from "src/users/entities/user.entity";
import { SignupUserResponseDto } from "src/users/dto/signup-user-response.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<Omit<User, "password">> {
    try {
      const user = await this.usersService.findOne({ where: { username } });
      const isMatchPassword = await this.hashService.compare(
        password,
        user.password
      );
      if (isMatchPassword) {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const { password, ...result } = user;
        return result;
      }
    } catch {
      throw new UnauthorizedException("Неправильный логин или пароль");
    }
  }

  async login(
    user: Omit<User, "password">
  ): Promise<Record<"access_token", string>> {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload, { secret: JWT_SECRET }),
    };
  }

  async register(registerData: CreateUserDto): Promise<SignupUserResponseDto> {
    const hashedPassword = await this.hashService.hash(registerData.password);
    registerData.password = hashedPassword;
    try {
      const user = await this.usersService.create(registerData);
      /* eslint-disable @typescript-eslint/no-unused-vars */
      const { password, offers, wishes, wishlists, ...responseUser } = user;

      return responseUser;
    } catch (error) {
      throw new ConflictException(
        "Не удалось создать запись. Возможно, такой юзер уже существует."
      );
    }
  }
}
