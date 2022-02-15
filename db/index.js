const devData = require('./data/development-data');
const testData = require('./data/test-data');

const data = { dev: devData, test: testData };
const ENV = process.env.NODE_ENV || "dev";

module.exports = data[ENV];