import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModuleAsyncOptions } from "@nestjs/jwt/dist";

export const jwtConfig: JwtModuleAsyncOptions = ({
    imports: [ ConfigModule ],
    inject:  [ ConfigService ],
    useFactory: ( configSvc: ConfigService ) => ({

        secret: configSvc.getOrThrow('jwt.secret'),
        signOptions: { 
            expiresIn: configSvc.getOrThrow('jwt.exp') 
        }
    }),
    
});