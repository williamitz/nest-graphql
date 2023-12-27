import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsResolver } from './items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Item } from './entities/item.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  providers: [ItemsResolver, ItemsService],
  imports: [
    TypeOrmModule.forFeature([ Item ])
  ],
  exports: [
    TypeOrmModule,
    ItemsService
  ]
})
export class ItemsModule {}
