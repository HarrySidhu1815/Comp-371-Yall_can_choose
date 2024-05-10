const mongoose = require('mongoose')


const ItemSchema = new mongoose.Schema({
    itemType: {type: String, required : true},
    condition: {type: String, required : true},
    description: {type: String, required : true},
    price: {type: String, required : true},
    location: {type: String, required : true},
    image: {type: String, required : false},
    user: {type: String, required : true},
  });

  const Item = mongoose.model('ItemData', ItemSchema);

  module.exports = Item;