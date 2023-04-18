import { Client } from 'pg';
import { DBConstants } from './globals';

export async function select(query: string) {
    const client = new Client({
        user: DBConstants.user,
        host: DBConstants.host,
        database: DBConstants.database,
        password: DBConstants.password,
        port: DBConstants.port
    });
    
    await client.connect();

    const res = await client.query(query);

    await client.end();
    return res;
}