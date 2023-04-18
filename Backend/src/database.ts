import { Client } from 'pg';
import { Logger } from './logger';
import { exit } from 'node:process';

export class DBConnection {
    public client: Client;
    public logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.createConnection();
    }

    async createConnection() {
        try {
            this.client = new Client({
                user: 'postgres',
                host: '127.0.0.1',
                database: 'postgres',
                password: '1Love4Postgres',
                port: 5432
            });
            await this.client.connect();
        } catch (error) {
            this.logger.error("Problem with connecting to DB: Is it running, correct password?");
            exit();
        }
    }

    async select(query: string): Promise<Object> {
        const res = await this.client.query(query);
        //console.log(res);
        return res;
    }
}