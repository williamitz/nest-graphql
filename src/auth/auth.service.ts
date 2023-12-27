import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { User } from 'src/users/entities/user.entity';
import { SingupInput, LoginInput } from './dto/inputs';
import { AuthResponse } from './types/auth-response.type';
import { IPayloadToken } from './types/payload-jwt.type';
import { handlerError } from '../common/helpers/handler-error.helper';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
    
    constructor(
        private readonly _userSvc: UsersService,
        private readonly _jwtSvc: JwtService
    ) {}
    
    async onSingUp( singupInput: SingupInput ): Promise<AuthResponse> {
    
        const newUser = await this._userSvc.create( singupInput );

        return {
            data: newUser,
            token: this._buildToken( { id: newUser.id } )
        };

    }

    async onLogin( loginInput: LoginInput ): Promise<AuthResponse> {
        
        try {

            const { email, password } = loginInput;

            const findUser = await this._userSvc.findOne( email );


            if( !findUser ) throw new NotFoundException(`User by email #${email}, not found`);

            if( !bcrypt.compareSync( password, findUser.password ) ) {
                throw new UnauthorizedException('Usuario o contraseña incorrecta');
            }

            return {
                data: findUser,
                token: this._buildToken( { id: findUser.id } )
            };
            
        } catch (error) {

            handlerError(error);
        }

    }

    async onValidateUser( id: string ): Promise<User> {
        
        const user = await this._userSvc.findOne( id );

        if( !user.isActive ) throw new UnauthorizedException( `Current user locked` );

        delete user.password;

        return user;

    }

    onRevalidateToken( user: User ): AuthResponse {
        return {
            data: user,
            token: this._buildToken( { id: user.id } )
        };
    }

    private _buildToken( payload: IPayloadToken ): string {
        return this._jwtSvc.sign( payload );
    }

}
