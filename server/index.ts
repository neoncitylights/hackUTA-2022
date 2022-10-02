import express from 'express';
import { query } from './db/infra.js';
import { createTables, loadSources } from './db/functions.js';

void (async () => {
    try {
        await createTables();

        const app = express();
        app.use(express.json());

        app
            .get('/api/execute-sql/:query', async (req, res) => {
                try {
                    const result = await query(req.params.query);
                    res.json({ success: true, ...result });
                } catch (e) {
                    res.statusCode = 500;
                    res.json({ success: false, error: (e as Error).message });
                }
            })
            .post('/api/load-sources', async (req, res) => {
                try {
                    if (typeof req.body === 'object' && typeof req.body.csv_content === 'string' && typeof req.body.override_existing === 'boolean') {
                        if (req.body.csv_content.match(/^Name,URL,License,Origin[\n\r]/)) {
                            await loadSources(req.body.csv_content, req.body.override_existing);
                            res.json({ success: true })
                        } else {
                            res.statusCode = 400;
                            res.json({ success: false, message: "Please ensure the CSV file has 'Name,URL,License,Origin' on the header row." })
                        }
                    } else {
                        res.statusCode = 400;
                        res.json({ success: false, message: 'Invalid body' });
                    }
                } catch (e) {
                    res.statusCode = 500;
                    res.json({ success: false, message: (e as Error).message });
                }
            })
            .get('/api/licenses', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(`SELECT DISTINCT license FROM sources ORDER BY license ASC`);
                res.json(result.rows.map(r => r.license));
            })
            .get('/api/origins', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(`SELECT DISTINCT origin FROM origins ORDER BY origin ASC`);
                res.json(result.rows.map(r => r.origin));
            })
            .get('/api/source', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(
                    `SELECT s.*, o.origin as origins FROM sources AS s
                    JOIN origins AS o ON s.name = o.source_name`
                );
                res.json(result.rows);
            })
            .get('/', (req, res) => {
                res.send('root');
            })
            .listen(3001);
    } catch (e) {
        console.error(e);
    }
})();
