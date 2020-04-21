const mongoose = require('mongoose');
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost/'
const dbName = process.env.MONGODB_DB_NAME || 'test'
console.log('Mongo Uri:', dbUri, 'MongoName:', dbName);
mongoose.connect(dbUri + dbName, {useNewUrlParser: true});

module.exports = mongoose
