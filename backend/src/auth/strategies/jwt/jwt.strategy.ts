import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { JWT_SECRET } from "src/utils/constants";
import {
  IJwtStrategyPayload,
  IJwtStrategyPayloadResponse,
} from "src/services/types";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(
    payload: IJwtStrategyPayload
  ): Promise<IJwtStrategyPayloadResponse> {
    return { id: payload.sub, username: payload.username };
  }
}
