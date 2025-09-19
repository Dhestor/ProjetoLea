import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, 
             array_agg(DISTINCT pf.feature) as features,
             jsonb_agg(DISTINCT jsonb_build_object(
               'id', pm.id,
               'type', pm.type,
               'url', pm.url,
               'is_featured', pm.is_featured,
               'order_index', pm.order_index,
               'created_at', pm.created_at
             )) as media
      FROM properties p
      LEFT JOIN property_features pf ON p.id = pf.property_id
      LEFT JOIN property_media pm ON p.id = pm.property_id
      WHERE p.status != 'expired'
      GROUP BY p.id
      ORDER BY p.created_at DESC
    `);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());
    
    // Iniciar uma transação
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Inserir o imóvel
      const propertyResult = await client.query(`
        INSERT INTO properties (
          title, internal_code, rip_id, address, reference_point, 
          google_maps_link, property_type_id, property_subtype_id,
          built_area, land_area, bedrooms, bathrooms, garage_spots,
          construction_year, description, internal_notes, market_price,
          minimum_price, deadline, payment_type, min_down_payment,
          max_installments, status, user_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 
                 $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
        RETURNING id
      `, [
        data.title,
        data.internal_code || null,
        data.rip_id || null,
        data.address,
        data.reference_point || null,
        data.google_maps_link || null,
        data.property_type_id,
        data.property_subtype_id,
        data.built_area || null,
        data.land_area || null,
        data.bedrooms || null,
        data.bathrooms || null,
        data.garage_spots || null,
        data.construction_year || null,
        data.description,
        data.internal_notes || null,
        data.market_price,
        data.minimum_price,
        data.deadline,
        data.payment_type,
        data.min_down_payment || 25,
        data.max_installments || 59,
        'active',
        1 // user_id temporário, depois implementaremos autenticação
      ]);

      const propertyId = propertyResult.rows[0].id;

      // Inserir características/features
      if (data.features) {
        const features = JSON.parse(data.features as string);
        for (const feature of features) {
          await client.query(`
            INSERT INTO property_features (property_id, feature)
            VALUES ($1, $2)
          `, [propertyId, feature]);
        }
      }

      // Processar e salvar imagens
      const files = formData.getAll('images') as File[];
      for (const [index, file] of files.entries()) {
        // Aqui você implementaria o upload da imagem para um serviço de armazenamento
        // e salvaria a URL retornada
        const imageUrl = `/images/properties/${file.name}`; // Exemplo simplificado
        
        await client.query(`
          INSERT INTO property_media (
            property_id, type, url, is_featured, order_index
          ) VALUES ($1, $2, $3, $4, $5)
        `, [
          propertyId,
          'photo',
          imageUrl,
          index === 0, // primeira imagem é featured
          index
        ]);
      }

      await client.query('COMMIT');

      // Buscar o imóvel completo com todas as relações
      const result = await client.query(`
        SELECT p.*, 
               array_agg(DISTINCT pf.feature) as features,
               jsonb_agg(DISTINCT jsonb_build_object(
                 'id', pm.id,
                 'type', pm.type,
                 'url', pm.url,
                 'is_featured', pm.is_featured,
                 'order_index', pm.order_index,
                 'created_at', pm.created_at
               )) as media
        FROM properties p
        LEFT JOIN property_features pf ON p.id = pf.property_id
        LEFT JOIN property_media pm ON p.id = pm.property_id
        WHERE p.id = $1
        GROUP BY p.id
      `, [propertyId]);

      return NextResponse.json(result.rows[0]);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
