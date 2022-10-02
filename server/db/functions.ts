import { getClient } from './infra.js';
import csv from 'csv-parser';
import { Readable } from 'stream';

export async function createTables(): Promise<void> {
    const client = await getClient();
    const statements = [
        `CREATE TABLE IF NOT EXISTS sources (
            name VARCHAR(256) PRIMARY KEY,
            url VARCHAR(256) NOT NULL,
            license VARCHAR(256) DEFAULT NULL,
            description VARCHAR(1024) DEFAULT NULL
        )`,
        `CREATE TABLE IF NOT EXISTS origins (
            source_name VARCHAR(256) REFERENCES sources(name),
            origin VARCHAR(256),
            PRIMARY KEY (source_name, origin)
        )`,
        `CREATE TABLE IF NOT EXISTS applications (
            source_name VARCHAR(256) REFERENCES sources(name),
            application VARCHAR(256),
            PRIMARY KEY (source_name, application)
        )`,
    ];

    await Promise.all(statements.map(s => client.query(s)));
    client.release();
}

export async function loadSources(text: string): Promise<void> {
    const client = await getClient();

    const rows = await parseCsv(text);
    await client.query('DELETE FROM sources');
    await client.query('DELETE FROM origins');
    for (const row of rows) {
        console.log(row);
        await client.query(
            `INSERT INTO sources (name, url, license)
             VALUES ($1, $2, $3)`, row.slice(0, 3)
        );
        const origins = row[3].split(/,\s*/);
        for (const origin of origins) {
            await client.query(
                `INSERT INTO origins (source_name, origin)
                VALUES ($1, $2)`, [row[0], origin]
            )
        }
    }
    // await Promise.all(rows.map(row => {
    //     console.log(row)
    //     client.query(
    //         `INSERT INTO sources (name, url, license, description)
    //         VALUES ($1, $2, $3, $4)`, row
    //     )
    // }))

    client.release();

    async function parseCsv(text: string): Promise<string[][]> {
        const ans: string[][] = [];
        return new Promise(resolve => {
            Readable
                .from(text)
                .pipe(csv({ headers: false }))
                .on('data', (row) => {
                    ans.push(Array.from({ ...row, length: Object.keys(row).length }));
                })
                .on('end', () => {
                    resolve(ans)
                })
        });
    }
}
