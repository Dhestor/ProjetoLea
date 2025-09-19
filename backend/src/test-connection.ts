import { createConnection } from 'typeorm';
import { config } from 'dotenv';

config();

async function testConnection() {
  try {
    console.log('Tentando conectar ao banco de dados...');
    const connection = await createConnection({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      entities: [],
    });

    console.log('Conexão estabelecida com sucesso!');
    await connection.query('SELECT NOW()');
    console.log('Consulta executada com sucesso!');
    
    await connection.close();
    console.log('Conexão fechada.');
  } catch (error) {
    console.error('Erro ao conectar:', error);
  }
}

testConnection();
