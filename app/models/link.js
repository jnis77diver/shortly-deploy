var db = require('../config');
var crypto = require('crypto');
var mongoose = require('mongoose');


var linkSchema = mongoose.Schema({
  url:  {type: String, required: true},
  base_url: {type: String, required: true},
  code: String,
  title: {type: String, required: true},
  visits: Number
});

var Link = mongoose.model('Link', linkSchema);

var createSha = function(url) {
  var shasum = crypto.createHash('sha1');
  shasum.update(url);
  return shasum.digest('hex').slice(0, 5);
};

linkSchema.pre('save', function(next) {
  var code = createSha(this.url);
  this.code = code;
  next();
});


module.exports = Link;
