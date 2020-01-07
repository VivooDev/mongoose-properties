const Property = require('./models/property');

module.exports = function (schema, options) {
  const property = new Property(options.collectionName);
  schema.add({ _properties_identifier: {type: 'mixed', default: options.identifier}});
  schema.add({ _properties: {type: 'mixed', default: []}});
  // schema.virtual('properties').
  //   get(function() { return this.__properties; }).
  //   set(function(v) { this._properties = v; });

  schema.methods.setProp = function (name, value, callback) {
    this._properties.push({'name': name, 'value': value});
  };

  schema.methods.getProp = function (name, callback) {
    /**
     * @todo: add logic for props
     * - keep latest ones in the main document
     * - keep the rest of the history in property doc
     */
  };

  schema.pre('save', async function (next) {
    await property.save(this._properties, this[this._properties_identifier]);
    delete this._properties;
    delete this._properties_identifier;
    next();
  });
};

