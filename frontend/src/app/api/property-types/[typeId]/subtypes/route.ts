import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

export async function GET(
  request: Request,
  context: { params: Promise<{ typeId: string }> }
) {
  try {
    const { typeId } = await context.params;
    const result = await pool.query(
      'SELECT * FROM property_subtypes WHERE property_type_id = $1 ORDER BY name',
      [typeId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
