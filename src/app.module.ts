import { Address, Media, Plug, ShoppingCentre, Store, Tag, User } from '@app/models';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as Joi from 'joi';
import { join } from 'path';
import { AddressesModule } from './addresses/addresses.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { MediasModule } from './medias/medias.module';
import { PlugsModule } from './plugs/plugs.module';
import { ShoppingCentresModule } from './shopping-centres/shopping-centres.module';
import { StoresModule } from './stores/stores.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'apps', 'admin', 'dist'),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      validationSchema: Joi.object({
        API_PORT: Joi.number().required(),
        ALLOWED_ORIGINS: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Address, Media, Plug, ShoppingCentre, Store, Tag, User],
        synchronize: true, //Todo: Investigate this for production, its too risky
      }),
      inject: [ConfigService],
    }),
    AddressesModule,
    BrandsModule,
    CategoriesModule,
    MediasModule,
    PlugsModule,
    ShoppingCentresModule,
    StoresModule,
    TagsModule,
    UsersModule,
  ],
})
export class AppModule {}
