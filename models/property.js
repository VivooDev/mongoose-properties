const mongoose = require('mongoose');
const { Schema } = mongoose;

class Property {
  constructor(collectionName, options = {postfix: '_properties'}) {
    this.collectionName = collectionName;
    this.options = options;
  }

  getModel() {
    const modelName = 'Property';
    const schema = new Schema({
      identifier: {
        type: Schema.Types.String,
        required: true,
      },
      name: {
        type: Schema.Types.String,
        required: true,
      },
      value: {
        type: Schema.Types.Mixed,
        required: true,
      },
    }, {
      timestamps: true,
    });

    return  mongoose.model(modelName, schema, this.collectionName + this.options.postfix);
  }

  save(properties, identifier){
    const model = this.getModel();
    let _documents = [];
    for(let i in properties){
      let property = properties[i];
      _documents.push({
        identifier: identifier,
        name: property.name,
        value: property.value,
      });
    }
    return model.insertMany(_documents);
  }
}

module.exports = Property;
