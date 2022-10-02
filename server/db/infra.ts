import pg from 'pg';
import type { PoolClient } from 'pg';
import dotenv from 'dotenv';
const { Pool } = pg;

const ClientLeakDurationMs = 10_000;

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = pool.query.bind(pool);

export async function getClient(): Promise<PoolClient> {
    const stack = new Error().stack
    const client = await pool.connect();
    const timeout = setTimeout(() => {
        console.error(`A client has been checked out for more than ${ClientLeakDurationMs} miliseconds\n${stack}`);
    }, ClientLeakDurationMs);

    return new Proxy(client, {
        get(target, p, receiver) {
            if (p === 'release') {
                return (err?: boolean | Error | undefined) => {
                    clearTimeout(timeout);
                    client.release.call(client, err);
                }
            }
            return Reflect.get(target, p, receiver);
        },
    });
}
