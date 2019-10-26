const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
const mongooseHidden = require('mongoose-hidden')();

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    description: {
        type: String,
        unique: true,
        required: [true, 'description is required']
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }
});

categorySchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });
categorySchema.plugin(mongooseHidden, { hidden: { _id: false } });

module.exports = mongoose.model('category', categorySchema);