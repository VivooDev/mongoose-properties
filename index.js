const Property = require('./models/property');

module.exports = function (schema, options) {
  const property = new Property(options.collectionName);
  schema.add({ _properties_identifier: { type: 'mixed', default: options.identifier } });
  schema.add({ _properties: { type: 'mixed', default: [] } });

  schema.methods.setProp = function (name, value, options, callback) {
    this._properties.push({ name, value, options });
    function setObjectValueViaDotNotation(obj, path, valueWillSet) {
      if (typeof path === 'string') {
        return setObjectValueViaDotNotation(obj, path.split('.'), valueWillSet);
      }
      if (path.length === 1 && valueWillSet !== undefined) {
        // eslint-disable-next-line no-param-reassign,no-return-assign
        return obj[path[0]] = valueWillSet;
      }
      if (path.length === 0) {
        return obj;
      }
      return setObjectValueViaDotNotation(obj[path[0]], path.slice(1), valueWillSet);
    }
    setObjectValueViaDotNotation(this, name, value);
  };

  schema.statics.properties = function () {
    return property.getModel();
  };

  schema.pre('save', async function (next) {
    await property.save(this._properties, this[this._properties_identifier]);
    this._properties = undefined;
    this._properties_identifier = undefined;
    next();
  });
};
