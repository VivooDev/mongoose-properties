const mongoose = require('mongoose');

const { Schema } = mongoose;
const mongooseProperties = require('./../../mongoose-properties');

// Schema attributes
const modelName = 'TestUser';
const collectionName = 'test_user';

const testUserSchema = new Schema({
  account: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    }
  },
  profile: {
    photo: {
      type: String,
      default: 'https://via.placeholder.com/150'
    },
  },
}, {
  timestamps: true,
});

testUserSchema.plugin(mongooseProperties, {
  history: 730,
  collectionName: collectionName,
  identifier: '_id',
});

module.exports.modelName = modelName;
module.exports.collectionName = collectionName;
module.exports.model = mongoose.model(modelName, testUserSchema, collectionName);
