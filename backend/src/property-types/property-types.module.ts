import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyTypesController } from './property-types.controller';
import { PropertyTypesService } from './property-types.service';
import { PropertyType } from '../entities/property-type.entity';
import { PropertySubtype } from '../entities/property-subtype.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PropertyType, PropertySubtype])],
  controllers: [PropertyTypesController],
  providers: [PropertyTypesService],
  exports: [PropertyTypesService],
})
export class PropertyTypesModule {}
