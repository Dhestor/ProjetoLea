import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PropertiesModule } from './properties/properties.module';
import { PropertyTypesModule } from './property-types/property-types.module';
import { AuthModule } from './auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProtectedRoutesMiddleware } from './middleware/protected-routes.middleware';
import { Property } from './entities/property.entity';
import { PropertyType } from './entities/property-type.entity';
import { PropertySubtype } from './entities/property-subtype.entity';
import { PropertyFeature } from './entities/property-feature.entity';
import { PropertyMedia } from './entities/property-media.entity';
import { Lead } from './entities/lead.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres' as const,
        host: 'aws-1-sa-east-1.pooler.supabase.com',
        port: 6543,
        database: 'postgres',
        username: 'postgres.eajsyyyhdyrzqxsthszy',
        password: 'Club321654987@M',
        ssl: {
          rejectUnauthorized: false
        },
        entities: [
          Property,
          PropertyType,
          PropertySubtype,
          PropertyFeature,
          PropertyMedia,
          Lead,
          User
        ],
        synchronize: false // Não usar true em produção
      }),
    }),
    SupabaseModule,
    AuthModule,
    PropertiesModule,
    PropertyTypesModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProtectedRoutesMiddleware)
      .exclude(
        { path: 'api/property-types', method: RequestMethod.GET },
        { path: 'api/property-types/(.*)', method: RequestMethod.GET }
      )
      .forRoutes('api/properties');
  }
}
