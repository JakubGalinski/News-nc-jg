const devData = require('../data/development-data/index.js');
const seed = require('./seed.js');
const db = require('../connection.js');

const runSeed = () => {
  return seed(devData)
    .then(() => {
      console.log("Succesful seeding");
      return db.end();
    })
    .catch((err) => {
      console.log(err, "Seeding err");
    })
};

runSeed();
module.exports = runSeed;