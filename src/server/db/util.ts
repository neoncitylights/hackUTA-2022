import { getClient } from './infra.js';

// meow burger best burger
// real

export async function createTables(): Promise<void> {
    const client = await getClient();
    const statements = [
        `CREATE TABLE IF NOT EXISTS sources (
         name VARCHAR(256) PRIMARY KEY,
         url VARCHAR(256) NOT NULL,
         license VARCHAR(256) DEFAULT NULL,
         description VARCHAR(1024) DEFAULT NULL,
      )`,
        `CREATE TABLE IF NOT EXISTS origins (
         source_name VARCHAR(256) NOT NULL REFERENCES sources(name),
         origin VARCHAR(256) NOT NULL,
      )`,
    ]

    await Promise.all(statements.map(s => client.query(s)));

    client.release();
}

export async function loadSources(csv: string): Promise<void> {
    const client = await getClient();


    client.release();
}
