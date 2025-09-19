import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyTypeId = searchParams.get('propertyTypeId');

  if (!propertyTypeId) {
    return NextResponse.json(
      { error: 'propertyTypeId é obrigatório' },
      { status: 400 }
    );
  }

  try {
    const result = await db.query(
      'SELECT id, name FROM property_subtypes WHERE property_type_id = $1 ORDER BY name',
      [propertyTypeId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar subtipos de imóveis:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar subtipos de imóveis' },
      { status: 500 }
    );
  }
}
