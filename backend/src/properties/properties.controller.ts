import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query, UseInterceptors, UploadedFiles, BadRequestException } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Property } from '../entities/property.entity';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 10, {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${file.fieldname}-${uniqueSuffix}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.includes('image')) {
        return cb(new Error('Only images are allowed'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    }
  }))
  async create(
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createPropertyDto: CreatePropertyDto
  ): Promise<Property> {
    console.log('Método create chamado');
    console.log('Arquivos recebidos:', files);
    console.log('Dados recebidos (raw):', createPropertyDto);

    try {
      // Transform numeric fields from strings to numbers
      const transformedData = {
        ...createPropertyDto,
        property_type_id: Number(createPropertyDto.property_type_id),
        property_subtype_id: Number(createPropertyDto.property_subtype_id),
        built_area: createPropertyDto.built_area ? Number(createPropertyDto.built_area) : undefined,
        land_area: createPropertyDto.land_area ? Number(createPropertyDto.land_area) : undefined,
        bedrooms: createPropertyDto.bedrooms ? Number(createPropertyDto.bedrooms) : undefined,
        bathrooms: createPropertyDto.bathrooms ? Number(createPropertyDto.bathrooms) : undefined,
        garage_spots: createPropertyDto.garage_spots ? Number(createPropertyDto.garage_spots) : undefined,
        construction_year: createPropertyDto.construction_year ? Number(createPropertyDto.construction_year) : undefined,
        market_price: Number(createPropertyDto.market_price),
        minimum_price: Number(createPropertyDto.minimum_price),
        min_down_payment: createPropertyDto.min_down_payment ? Number(createPropertyDto.min_down_payment) : undefined,
        max_installments: createPropertyDto.max_installments ? Number(createPropertyDto.max_installments) : undefined,
      };

      console.log('Transformed data:', transformedData);

      // Convert plain object to class instance for validation
      const propertyInstance = plainToInstance(CreatePropertyDto, transformedData);
      
      // Log the instance before validation
      console.log('Property instance before validation:', propertyInstance);
      
      // Validate the instance
      const errors = await validate(propertyInstance, {
        whitelist: true,
        forbidNonWhitelisted: true,
        validationError: { target: false }
      });
      
      if (errors.length > 0) {
        console.error('Validation errors found:');
        errors.forEach(error => {
          console.error(`- Property: ${error.property}`);
          console.error(`  Value: ${error.value}`);
          console.error(`  Constraints:`, error.constraints);
        });
        
        throw new BadRequestException({
          message: 'Validation failed',
          errors: errors.map(error => ({
            property: error.property,
            value: error.value,
            constraints: error.constraints
          }))
        });
      }

      // Create the property with images and transformed data
      return this.propertiesService.create(transformedData as CreatePropertyDto, files);
    } catch (error) {
      console.error('Error in create method:', error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException({
        message: 'Failed to create property',
        error: error.message
      });
    }
  }

  @Get()
  async findAll(@Query('page') page = 1, @Query('limit') limit = 10): Promise<{ data: Property[]; count: number }> {
    return this.propertiesService.findAll({
      page: Number(page),
      limit: Number(limit)
    });
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Property> {
    return this.propertiesService.findOne(Number(id));
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    return this.propertiesService.update(Number(id), updatePropertyDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.propertiesService.remove(Number(id));
  }

  @Post(':id/media')
  async saveMedia(@Param('id') id: string, @Body() body: { urls: string[] }) {
    console.log('Endpoint saveMedia chamado para propriedade:', id);
    console.log('URLs recebidas:', body.urls);
    return this.propertiesService.saveMedia(Number(id), body.urls);
  }

  @Delete('media/:mediaId')
  async deleteMedia(@Param('mediaId') mediaId: string) {
    console.log('Deletando mídia ID:', mediaId);
    return this.propertiesService.deleteMedia(Number(mediaId));
  }
}
