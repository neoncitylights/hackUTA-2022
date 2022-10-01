import express from 'express';
import { createTables } from './db/util.js';

void (async () => {
    try {
        await createTables();

        const app = express();

        app.get('/', (req, res) => {

        });

        app.listen(3001);
    } catch (e) {
        console.error(e);
    }
})();
