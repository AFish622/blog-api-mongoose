'use strict';

// db name goes in ENV... collection in models

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/seed';
console.log('STRING', exports.DATABASE_URL)
exports.PORT = process.env.PORT || 8080;