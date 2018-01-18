'use strict';

exports.DATABASE_URL = process.env.DATABASE_URL || 'mongodb://localhost/capstone2';
exports.TEST_DATABASE_URL = process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-capstone2';
exports.PORT = process.env.PORT || 8080;