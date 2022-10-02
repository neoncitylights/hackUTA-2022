import { getClient, query } from './infra.js';
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
        `CREATE TABLE IF NOT EXISTS subscriptions (
            source_name VARCHAR(256) REFERENCES sources(name),
            phone_number VARCHAR(16),
            PRIMARY KEY (source_name, phone_number)
        )`,
        `CREATE TABLE IF NOT EXISTS updates (
            id SERIAL PRIMARY KEY,
            source_name VARCHAR(256) REFERENCES sources(name),
            timestamp TIMESTAMP NOT NULL,
            details VARCHAR(1024) NOT NULL
        )`
    ];

    await Promise.all(statements.map(s => client.query(s)));
    client.release();
}

export async function loadSources(csvText: string, overrideExisting: boolean): Promise<void> {
    const rows = await parseCsv(csvText);
    if (overrideExisting) {
        await query(
            `DELETE FROM applications;
            DELETE FROM origins;
            DELETE FROM subscriptions;
            DELETE FROM updates;
            DELETE FROM sources;`
        );
    }
    await bulkInsert('sources', ['name', 'url', 'license'], rows.map(row => row.slice(0, 3)))

    const originRows: [string, string][] = []
    for (const row of rows) {
        const origins = row[3].split(/,\s*/);
        for (const origin of origins) {
            originRows.push([row[0], origin]);
        }
    }
    await bulkInsert('origins', ['source_name', 'origin'], originRows)

    const applicationRows: [string, string][] = []
    for (const row of rows) {
        const applications = row[4].split(/,\s*/);
        for (const application of applications) {
            applicationRows.push([row[0], application]);
        }
    }
    await bulkInsert('applications', ['source_name', 'application'], applicationRows)

    async function parseCsv(text: string): Promise<string[][]> {
        const ans: string[][] = [];
        return new Promise((resolve, reject) => {
            Readable
                .from(text)
                .pipe(csv())
                .on('data', (row) => {
                    if (!(row.Name && row.URL && row.License && row.Origin && row.Applications)) {
                        reject(new Error(`Bad row: ${JSON.stringify(row)}`));
                    }
                    ans.push([row.Name, row.URL, row.License, row.Origin, row.Applications]);
                })
                .on('end', () => {
                    resolve(ans)
                })
        });
    }
}

export async function bulkInsert(table: string, columns: string[], rows: string[][]): Promise<void> {
    let placeholderIndex = 1;
    const placeholders: string = rows.map(
        _ => '(' + columns.map(_ => `$${placeholderIndex++}`).join(', ') + ')'
    ).join(', ');
    await query(
        `INSERT INTO ${table} (${columns.join(',')}) VALUES ${placeholders}`,
        rows.flat()
    );
}
