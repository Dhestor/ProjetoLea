import { Controller, Get, Param, HttpStatus, HttpException } from '@nestjs/common';
import { PropertyTypesService } from './property-types.service';

@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly propertyTypesService: PropertyTypesService) {}

  @Get()
  async findAll() {
    try {
      const types = await this.propertyTypesService.findAll();
      if (!types || types.length === 0) {
        throw new HttpException('Nenhum tipo de imóvel encontrado', HttpStatus.NOT_FOUND);
      }
      return types;
    } catch (error) {
      console.error('Erro ao buscar tipos de imóveis:', error);
      throw new HttpException(
        error.message || 'Erro ao buscar tipos de imóveis',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id/subtypes')
  async findSubtypes(@Param('id') id: number) {
    try {
      const subtypes = await this.propertyTypesService.findSubtypesByTypeId(id);
      if (!subtypes || subtypes.length === 0) {
        throw new HttpException('Nenhum subtipo encontrado para este tipo de imóvel', HttpStatus.NOT_FOUND);
      }
      return subtypes;
    } catch (error) {
      console.error('Erro ao buscar subtipos:', error);
      throw new HttpException(
        error.message || 'Erro ao buscar subtipos',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
