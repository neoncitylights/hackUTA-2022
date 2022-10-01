import express from 'express';
import { createTables } from './db/functions.js';

void (async () => {
    try {
        await createTables();

        const app = express();

        app
            .get('/api/source', (req, res) => {
                res.send('duh');
            })
            .get('/', (req, res) => {
                res.send('root');
            })
            .listen(3001);
    } catch (e) {
        console.error(e);
    }
})();
