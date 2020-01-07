const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongooseProperties = require('./../../mongoose-properties');

// Schema attributes
const modelName = 'TestModel';
const collectionName = 'ali_test_model';

const testModelSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

testModelSchema.plugin(mongooseProperties, {
  history: 730,
  collectionName: collectionName,
  identifier: 'userId',
});

module.exports.modelName = modelName;
module.exports.collectionName = collectionName;
module.exports.model = mongoose.model(modelName, testModelSchema, collectionName);
