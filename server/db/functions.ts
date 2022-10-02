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
    ];

    await Promise.all(statements.map(s => client.query(s)));
    client.release();
}

export async function loadSources(csvText: string, overrideExisting: boolean): Promise<void> {
    const rows = await parseCsv(csvText);
    if (overrideExisting) {
        await query('DELETE FROM origins; DELETE FROM sources');
    }
    await bulkInsert('sources', ['name', 'url', 'license'], rows.map(r => r.slice(0, 3)))

    const originRows: [string, string][] = []
    for (const row of rows) {
        const origins = row[3].split(/,\s*/);
        for (const origin of origins) {
            originRows.push([row[0], origin]);
        }
    }
    await bulkInsert('origins', ['source_name', 'origin'], originRows)

    async function parseCsv(text: string): Promise<string[][]> {
        const ans: string[][] = [];
        return new Promise(resolve => {
            Readable
                .from(text)
                .pipe(csv({ headers: false, skipLines: 1 }))
                .on('data', (row) => {
                    ans.push(Array.from({ ...row, length: Object.keys(row).length }));
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
