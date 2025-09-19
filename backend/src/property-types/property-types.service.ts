import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PropertyType } from '../entities/property-type.entity';
import { PropertySubtype } from '../entities/property-subtype.entity';

@Injectable()
export class PropertyTypesService {
  constructor(
    @InjectRepository(PropertyType)
    private propertyTypeRepository: Repository<PropertyType>,
    @InjectRepository(PropertySubtype)
    private propertySubtypeRepository: Repository<PropertySubtype>
  ) {}

  async findAll() {
    console.log('Buscando todos os tipos de propriedade...');
    const types = await this.propertyTypeRepository.find({
      relations: ['subtypes'],
      order: { name: 'ASC' }
    });
    console.log('Tipos encontrados:', types);
    return types;
  }

  async findSubtypesByTypeId(typeId: number) {
    console.log('Buscando subtipos para o tipo:', typeId);
    const subtypes = await this.propertySubtypeRepository.find({
      where: { property_type_id: typeId },
      relations: ['propertyType'],
      order: { name: 'ASC' }
    });
    console.log('Subtipos encontrados:', subtypes);
    return subtypes;
  }
}
