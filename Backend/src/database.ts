import { Client } from 'pg';
import { Logger } from './logger';
import { exit } from 'node:process';
import { CREATE_INGREDIENTS_VIEW } from './queries';

export class DBConnection {
    public client: Client;
    public logger: Logger;

    constructor(logger: Logger) {
        this.logger = logger;
        this.createConnection();
        this.createViews();
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

    async createViews() {
        try {
            const res = await this.client.query(CREATE_INGREDIENTS_VIEW());
        } catch (error) {
            this.logger.error("Problem with creating the views: "+error.Message);
        }
    }

    async select(query: string): Promise<Object> {
        try {
            const res = await this.client.query(query);
            //this.logger.info(res.rows);
            return res;
        } catch (error) {
            this.logger.error("Problem with connecting query: "+error.Message);
        }

    }
}