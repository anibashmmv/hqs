const mongoose = require('mongoose');
const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    testId: {type: Number, required: true},
    testType: {type: String, required: true},
    name: {type: String, required: true},
});
module.exports = mongoose.model('Product', productSchema);

