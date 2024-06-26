import { JwtUserPayload } from "@/interfaces";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("security.jwt.secret")!,
    });
  }

  async validate(payload: JwtUserPayload) {
    return { userId: payload.userId, email: payload.email } as JwtUserPayload;
  }
}
