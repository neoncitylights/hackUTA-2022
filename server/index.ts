import express from 'express';
import { getClient, query } from './db/infra.js';
import { createTables, loadSources } from './db/functions.js';
import twilio from 'twilio';
import dotenv from 'dotenv';

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

dotenv.config();

void (async () => {
    try {
        await createTables();

        const app = express();
        app.use(express.json());

        app
            .get('/api/admin/execute-sql/:query', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                try {
                    const result = await query(req.params.query);
                    res.json({ success: true, ...result });
                } catch (e) {
                    res.statusCode = 500;
                    res.json({ success: false, message: (e as Error).message });
                }
            })
            .post('/api/admin/load-sources', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                try {
                    if (typeof req.body === 'object' && typeof req.body.csv_content === 'string' && typeof req.body.override_existing === 'boolean') {
                        await loadSources(req.body.csv_content, req.body.override_existing);
                        res.json({ success: true })
                    } else {
                        res.statusCode = 400;
                        res.json({ success: false, message: 'Invalid body' });
                    }
                } catch (e) {
                    res.statusCode = 500;
                    res.json({ success: false, message: (e as Error).message });
                }
            })
            .post('/api/admin/send-update', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                if (!(typeof req.body.source_name === 'string' && typeof req.body.details === 'string')) {
                    res.statusCode = 400;
                    res.json({ success: false, message: 'Invalid body' });
                    return
                }
                const client = await getClient();
                try {
                    await client.query(
                        `INSERT INTO updates (source_name, timestamp, details) VALUES ($1, $2, $3)`,
                        [req.body.source_name, new Date().toISOString(), req.body.details]
                    )
                    const { rows } = await client.query(
                        `SELECT phone_number FROM subscriptions WHERE source_name = $1`,
                        [req.body.source_name]
                    )
                    for (const row of rows) {
                        console.log({
                            messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_ID,
                            to: row.phone_number,
                            body: `The dataset you subscribed, ${req.body.source_name}, just got an update: ${req.body.details}`
                        })
                        await twilioClient.messages.create({
                            messagingServiceSid: process.env.TWILIO_MESSAGE_SERVICE_ID,
                            to: row.phone_number,
                            body: `The dataset you subscribed, ${req.body.source_name}, just got an update: ${req.body.details}`
                        });
                    }
                    res.json({ success: true, total_sent: rows.length })
                } catch (e) {
                    res.statusCode = 500;
                    res.json({ success: false, message: (e as Error).message });
                } finally {
                    client.release()
                }
            })
            .post('/api/subscribe', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                try {
                    if (typeof req.body.source_name === 'string' && typeof req.body.phone_number === 'string' && req.body.phone_number.match(/^\+1\d{10}$/)) {
                        await query(
                            `INSERT INTO subscriptions (source_name, phone_number) VALUES ($1, $2)`,
                            [req.body.source_name, req.body.phone_number]
                        );
                        res.json({ success: true });
                    } else {
                        res.json({ success: false, message: 'Expected phone number format: +1##########.' })
                    }
                } catch (e) {
                    res.statusCode = 500;
                    res.json({ success: false, message: (e as Error).message });
                }
            })
            .get('/api/applications', async (req, res) => {
                res.set('Access-Control-Allow-Origin', '*');
                const result = await query(`SELECT DISTINCT application FROM applications ORDER BY application ASC`);
                res.json(result.rows.map(r => r.application));
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
                    `SELECT s.*, a.application as application, o.origin as origin FROM sources AS s
                    JOIN applications AS a ON s.name = a.source_name
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
