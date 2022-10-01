import { getClient } from './infra.js';

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

export async function loadSources(csv: string): Promise<void> {
    const client = await getClient();


    client.release();

    function parseCsv(text: string): string[][] {
        const ans: string[][] = [];
        if (text) {
            let row = 0, cursor = 0;
            ans.push([]);
            while (cursor < text.length) {
                ans[row].push(readCell(text, cursor));
                if (text[cursor] === ',') {
                    cursor++;
                } else {
                    cursor++;
                    row++;
                    ans.push([]);
                }
            }
        }
        return ans;

        function readCell(text: string, cursor: number): string {
            let ans = '';
            if (text[cursor] === '"') {
                cursor++;
                while (cursor < text.length) {
                    if (text[cursor] === '"') {
                        cursor++;
                        if (text[cursor] === '"') {
                            // Escaped quote.
                            ans += '"';
                            cursor++;
                        } else {
                            break;
                        }
                    } else {
                        ans += text[cursor];
                        cursor++;
                    }
                }
            } else {
                while (cursor < text.length && text[cursor] !== ',') {
                    ans += text[cursor];
                    cursor++
                }
            }
            return ans;   
        }
    }
}
