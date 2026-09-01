require("dotenv").config();

const tasks = require("./routes/tasks");
const connection = require("./db");
const cors = require("cors");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const promClient = require('prom-client');

connection();

app.use(express.json());
app.use(cors());

// ⬇️ Prometheus metrics setup
promClient.collectDefaultMetrics();

const httpRequestsTotal = new promClient.Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method', 'route', 'status']
});

// ⬇️ Middleware routes
app.use((req, res, next) => {
    res.on('finish', () => {
        httpRequestsTotal.inc({
            method: req.method,
            route: req.route ? req.route.path : req.path,
            status: res.statusCode
        });
    });
    next();
});

// ⬇️ Endpoint Prometheus
app.get('/metrics', async (req, res) => {
    res.set('Content-Type', promClient.register.contentType);
    res.end(await promClient.register.metrics());
});

// Health check endpoints

// Basic health check to see if the server is running
app.get('/healthz', (req, res) => {
    res.status(200).send('Healthy');
});

// Readiness check
// Backend remains Ready even if MongoDB is temporarily unavailable.
// Database-dependent requests will return HTTP 500 from the routes.
app.get('/ready', (req, res) => {
    res.status(200).send('Ready');
});

// Startup check to ensure the server has started correctly
app.get('/started', (req, res) => {
    res.status(200).send('Started');
});

app.use("/api/tasks", tasks);

const port = process.env.PORT || 3500;
app.listen(port, () => console.log(`Listening on port ${port}...`));