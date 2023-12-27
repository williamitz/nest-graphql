import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModuleAsyncOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleAsyncOptions = ({
    imports: [ ConfigModule ],
    useFactory: ( configSvc: ConfigService ) => ({
        
        ssl: configSvc.getOrThrow<'dev' | 'prod'>('app_mode') == 'prod',
        extra: {
            ssl: configSvc.getOrThrow<'dev' | 'prod'>('app_mode') == 'prod' 
                ? { rejectUnauthorized: false }
                : null
        },

        type: configSvc.getOrThrow<'mysql' | 'postgres'>('database.db_type'),
        host: configSvc.getOrThrow<string>('database.db_host'),
        port: +configSvc.getOrThrow<string>('database.db_port'),
        username: configSvc.getOrThrow<string>('database.db_user'),
        password: configSvc.getOrThrow<string>('database.db_password'),
        database: configSvc.getOrThrow<string>('database.db_name'),

        synchronize: true, // deshabilitar en prod, las nuevas columnas se agregan manualmente
        autoLoadEntities: true

    }),
    inject: [ ConfigService ]
});