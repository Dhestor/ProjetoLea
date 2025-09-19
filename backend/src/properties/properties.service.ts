import { Injectable } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { Property } from '../entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import * as fs from 'fs/promises';

interface PaginationParams {
  page: number;
  limit: number;
}

@Injectable()
export class PropertiesService {
  private readonly BUCKET_NAME = 'property-images';
  
  constructor(private supabaseService: SupabaseService) {}

  async create(propertyDto: CreatePropertyDto, files?: Express.Multer.File[]) {
    console.log('Dados recebidos no método create:', propertyDto);
    console.log('Arquivos recebidos:', files);

    const propertyWithDefaults = {
      ...propertyDto,
      status: propertyDto.status || 'active'
    };

    // Remove features and media_urls from property data as they're stored in separate tables
    const { features, media_urls, ...propertyData } = propertyWithDefaults;

    console.log('Enviando para Supabase:', propertyData);

    const supabase = this.supabaseService.getClient();
    
    try {
      // 1. Insert the property
      const { data: property, error: propertyError } = await supabase
        .from('properties')
        .insert(propertyData)
        .select()
        .single();

      if (propertyError) throw propertyError;

      // 2. Insert features if any
      if (features && Array.isArray(features) && features.length > 0) {
        const featureRows = features.map(feature => ({
          property_id: property.id,
          feature
        }));

        const { error: featuresError } = await supabase
          .from('property_features')
          .insert(featureRows);

        if (featuresError) throw featuresError;
      }

      // 3. Handle media URLs if any
      if (media_urls && Array.isArray(media_urls) && media_urls.length > 0) {
        console.log('Inserindo URLs de mídia:', media_urls);
        for (let i = 0; i < media_urls.length; i++) {
          const url = media_urls[i];
          
          const { error: mediaError } = await supabase
            .from('property_media')
            .insert({
              property_id: property.id,
              type: 'image',
              url: url,
              is_featured: i === 0
            });

          if (mediaError) {
            console.error('Erro ao inserir mídia:', mediaError);
            throw mediaError;
          }
        }
      }

      // 4. Handle file uploads if any
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          
          try {
            // Read the file from disk
            const fileBuffer = await fs.readFile(file.path);
            
            // Generate a unique filename
            const fileName = `${Date.now()}-${file.originalname}`;
            
            // Upload to Supabase Storage
            const { data: uploadData, error: uploadError } = await supabase
              .storage
              .from(this.BUCKET_NAME)
              .upload(fileName, fileBuffer, {
                contentType: file.mimetype,
                upsert: true
              });

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data: urlData } = supabase
              .storage
              .from(this.BUCKET_NAME)
              .getPublicUrl(fileName);

            // Create media entry
            const { error: mediaError } = await supabase
              .from('property_media')
              .insert({
                property_id: property.id,
                type: 'photo',
                url: urlData.publicUrl,
                is_featured: i === 0, // First image is featured
                order_index: i
              });

            if (mediaError) throw mediaError;

            // Clean up the temporary file
            await fs.unlink(file.path);
          } catch (error) {
            console.error(`Error processing file ${file.originalname}:`, error);
            throw error;
          }
        }
      }

      // Return the complete property data
      const { data: propertyWithMedia, error: finalError } = await supabase
        .from('properties')
        .select(`
          *,
          property_type:property_types(*),
          property_subtype:property_subtypes(*),
          media:property_media(*),
          property_features(feature)
        `)
        .eq('id', property.id)
        .single();

      if (finalError) throw finalError;
      
      return propertyWithMedia as Property;
      
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      console.error('Detalhes do erro:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
  }

  async findAll(params: PaginationParams) {
    const { page, limit } = params;
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const countQuery = await this.supabaseService
      .getClient()
      .from('properties')
      .select('id', { count: 'exact' });

    const { data, error } = await this.supabaseService
      .getClient()
      .from('properties')
      .select(`
        *,
        property_type:property_types(*),
        property_subtype:property_subtypes(*),
        media:property_media(*),
        property_features(feature)
      `)
      .order('created_at', { ascending: false })
      .range(start, end);

    if (error || countQuery.error) throw error || countQuery.error;
    
    return {
      data: data as Property[],
      count: countQuery.count || 0
    };
  }

  async findOne(id: number): Promise<Property> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('properties')
      .select(`
        *,
        property_type:property_types(*),
        property_subtype:property_subtypes(*),
        media:property_media(*),
        property_features(feature)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data as Property;
  }

  async update(id: number, propertyDto: UpdatePropertyDto): Promise<Property> {
    const { data, error } = await this.supabaseService
      .getClient()
      .from('properties')
      .update(propertyDto)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Property;
  }

  async remove(id: number): Promise<void> {
    const supabase = this.supabaseService.getClient();
    
    // Primeiro deletar as mídias relacionadas
    const { error: mediaError } = await supabase
      .from('property_media')
      .delete()
      .eq('property_id', id);

    if (mediaError) throw mediaError;
    
    // Depois deletar o imóvel
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  async saveMedia(propertyId: number, urls: string[]) {
    const supabase = this.supabaseService.getClient();
    
    // Verificar se já existe imagem principal
    const { data: existingMedia } = await supabase
      .from('property_media')
      .select('id')
      .eq('property_id', propertyId)
      .eq('is_featured', true)
      .single();
    
    const hasFeatured = !!existingMedia;
    
    for (let i = 0; i < urls.length; i++) {
      const { error } = await supabase
        .from('property_media')
        .insert({
          property_id: propertyId,
          type: 'image',
          url: urls[i],
          is_featured: !hasFeatured && i === 0 // Só primeira é principal se não houver
        });

      if (error) throw error;
    }
    
    return { success: true };
  }

  async deleteMedia(mediaId: number) {
    const supabase = this.supabaseService.getClient();
    
    const { error } = await supabase
      .from('property_media')
      .delete()
      .eq('id', mediaId);

    if (error) throw error;
    
    return { success: true };
  }
}
