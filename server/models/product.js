const mongoose = require('mongoose');
const mongooseHidden = require('mongoose-hidden')();

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, 'name is required']
    },
    unitPrice: {
        type: Number,
        required: [true, 'unit price is required']
    },
    description: {
        type: String,
        required: false
    },
    available: {
        type: Boolean,
        required: true,
        default: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

productSchema.plugin(mongooseHidden, { hidden: { _id: false } });

module.exports = mongoose.model('product', productSchema);