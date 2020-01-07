const Model = require('./_model').model;
const db = require('../../db/connection')();

db.connect();

function run(){
  return new Promise(async (resolve, reject) => {
    try {
      let model = new Model({
        'name': 'DENEME',
        'userId': '2jh3j2h3j2h3h2jh3123712y371'
      });

      model.setProp('age', 2);
      model.setProp('weight', 70);

      await Model.create(model);
      resolve();
    }catch (e) {
      console.error(e);
      reject(e);
    }
  });
}


run().then(() => {
  console.log('PASSED!');
  process.exit(0);
}).catch((e)=>{
  console.error(e);
});