"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pg_1 = require("pg");
var dotenv_1 = require("dotenv");
(0, dotenv_1.configDotenv)();
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
pool.connect(function (err, client, release) {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
    }
    else {
        console.log('Connected to the database');
        release();
    }
});
exports.default = pool;
