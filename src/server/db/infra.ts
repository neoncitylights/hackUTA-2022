import { Pool, PoolClient } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const ClientLeakDurationMs = 5000; // 5 seconds

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

export const query = pool.query.bind(pool);

export async function getClient(): Promise<PoolClient> {
    const client = await pool.connect();
    const timeout = setTimeout(() => {
        console.error(`A client has been checked out for more than ${ClientLeakDurationMs} miliseconds`);
        console.trace();
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
