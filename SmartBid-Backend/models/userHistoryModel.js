const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');


const userHistorySchema = new Schema({
    history:{
        type:Array
    }

},
 {
    collection: 'history',
    timestamps: true
}

);

const userHistory = mongoose.model('UserHistory', userHistorySchema);
module.exports = userHistory;