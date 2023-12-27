import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { IPayloadToken } from "../types/payload-jwt.type";
import { User } from '../../users/entities/user.entity';
import { AuthService } from "../auth.service";

@Injectable()
export class JwtDefaultStrategy extends PassportStrategy( Strategy ) {

    constructor(
        private readonly _configSvc: ConfigService,
        private readonly _authSvc: AuthService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: _configSvc.getOrThrow('jwt.secret'),
        });
    }

    async validate( payload: IPayloadToken ): Promise<User> {
        
        // console.log('payload ::: ', payload );

        const { id } = payload;

        const user = await this._authSvc.onValidateUser( id );

        return user;

        // throw new UnauthorizedException('Token not valid 🚨');

    }

}