import { Client } from 'pg';

export async function selectIngredients() {
    const client = new Client({
        user: 'postgres',
        host: '127.0.0.1',
        database: 'postgres',
        password: '',
        port: 5432
    });
    
    await client.connect();

    const res = await client.query('SELECT * from ingredients LIMIT 100');

    await client.end();
    return res;
    
}