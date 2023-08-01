import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from 'passport-jwt';
import { BlockedTokenlistService } from "src/databases/BlockedTokenList/BlockedTokenList.service";
import { User } from "src/databases/user.entity";
import { UserService } from "src/user/user.service";
import { Repository } from "typeorm";

export type JwtPayload = {
    sub: string;
    email: string;
  };
  
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') 
{
    private request: any;
    constructor(
        private readonly configService: ConfigService,
        private readonly userService: UserService,
        private readonly BlockedTokenService: BlockedTokenlistService
    ) {
        const extractJwtFromCookie = (req) => {
                this.request = req;
                let token = null;
                if (req && req.cookies) {
                    token = req.cookies['access_token'];
                    if(!token)
                        token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
                }
                return token;
            };
        super({
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
            jwtFromRequest: extractJwtFromCookie,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.userService.findUserByEmail(payload.email);
        if (!user) throw new UnauthorizedException('Please log in to continue');
        if((await this.BlockedTokenService.blackListhasToken(this.request.cookies['access_token'])) === true)
            throw new UnauthorizedException('token is not valid');
        console.log('CHAMP')
        return {
            id: payload.sub,
            email: payload.email,
        };
    }
}