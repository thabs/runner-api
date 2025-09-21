import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Address } from 'addresses/entities/address.entity';
import { City } from 'cities/entities/city.entity';
import { Country } from 'countries/entities/country.entity';
import * as Joi from 'joi';
import { Media } from 'medias/entities/media.entity';
import { join } from 'path';
import { Plug } from 'plugs/entities/plug.entity';
import { Province } from 'provinces/entities/province.entity';
import { ShoppingCentre } from 'shopping-centres/entities/shopping-centre.entity';
import { Store } from 'stores/entities/store.entity';
import { Tag } from 'tags/entities/tag.entity';
import { User } from 'users/entities/user.entity';
import { AddressesModule } from './addresses/addresses.module';
import { CitiesModule } from './cities/cities.module';
import { CountriesModule } from './countries/countries.module';
import { MediasModule } from './medias/medias.module';
import { PlugsModule } from './plugs/plugs.module';
import { ProvincesModule } from './provinces/provinces.module';
import { ShoppingCentresModule } from './shopping-centres/shopping-centres.module';
import { StoresModule } from './stores/stores.module';
import { TagsModule } from './tags/tags.module';
import { UsersModule } from './users/users.module';
import { BrandsModule } from './brands/brands.module';

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
        entities: [Address, City, Country, Media, Plug, Province, ShoppingCentre, Store, Tag, User],
        synchronize: true, //Todo: Investigate this for production, its too risky
      }),
      inject: [ConfigService],
    }),
    PlugsModule,
    UsersModule,
    AddressesModule,
    StoresModule,
    MediasModule,
    TagsModule,
    ShoppingCentresModule,
    CountriesModule,
    ProvincesModule,
    CitiesModule,
    BrandsModule,
  ],
})
export class AppModule {}
