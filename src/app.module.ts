import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { CommonModule } from './common/common.module';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ListsModule } from './lists/lists.module';
import { ListItemModule } from './list-item/list-item.module';

@Module({
  imports: [
    
    CommonModule,
    
    ItemsModule,
    
    UsersModule,
    
    AuthModule,
    
    ListsModule,
    
    ListItemModule,

  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  
  static port: number;

  constructor(
    private readonly _confgSvc: ConfigService
  ){
    AppModule.port = +this._confgSvc.getOrThrow('port');

    // console.log('jwt env ::: ', this._confgSvc.get('jwt'));
    // console.log('database env ::: ', +this._confgSvc.get('database.db_port'));
  }

}
