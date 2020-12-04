const mongoose = require('mongoose');

const { Schema } = mongoose;

class Property {
  constructor(collectionName, options = { postfix: '_properties' }) {
    this.collectionName = collectionName;
    this.options = options;
  }

  getModel() {
    let model;
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
      options: {
        maxCount: {
          type: Schema.Types.Number,
          required: true,
          default: 0,
        },
      },
    }, {
      timestamps: true,
    });
    if (mongoose.models[modelName]) {
      model = mongoose.model(modelName);
    } else {
      model = mongoose.model(modelName, schema, this.collectionName + this.options.postfix);
    }
    return model;
  }

  preSaveControls(model, doc) {
    return new Promise(async (resolve, reject) => {
      if (doc.options.maxCount) {
        const intMaxCount = parseInt(doc.options.maxCount, 10);
        const docCount = await model.countDocuments({
          name: doc.name,
          identifier: doc.identifier,
        }).exec();
        if (docCount >= intMaxCount && doc.options.replace !== true) {
          return reject(new Error('Max property count exceeded.'));
        }
        if (docCount < intMaxCount && doc.options.replace === true) {
          // eslint-disable-next-line no-param-reassign
          delete doc.options.replace;
        }
      }
      return resolve(doc);
    });
  }


  async save(properties, identifier) {
    const model = this.getModel();
    const _documentsToSave = [];
    const _documentsToUpdate = [];
    const _errors = []; // @todo: think about that next time should we ignore or return them?.
    for (let i = 0; i < properties.length; i += 1) {
      const property = properties[i];
      // eslint-disable-next-line no-await-in-loop , //we should fix that later for performance.
      const doc = await this.preSaveControls(model, {
        identifier,
        name: property.name,
        value: property.value,
        options: property.options || {},
      }).catch((err) => {
        _errors.push(err);
      });
      if (doc) {
        switch (true) {
          case (doc.options.replace === true):
            _documentsToUpdate.push(doc);
            break;
          default: _documentsToSave.push(doc);
        }
      }
    }
    const waitForImports = [];
    waitForImports.push(model.create(_documentsToSave));
    for (const doc of _documentsToUpdate) {
      waitForImports.push(model.findOneAndReplace(
        { name: doc.name, identifier: doc.identifier }, doc, { sort: { createdAt: 1 }, upsert: true },
      ));
    }
    return Promise.all(waitForImports);
  }
}

module.exports = Property;
