/**
 * Created by rumeili on 16/3/19.
 */
var mongoose = require('mongoose');

var PrecmdSchema = new mongoose.Schema({
    date: Date,
    horaire: String,
    status: {type: Boolean, default: false},
    username: String,
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
});

//when the precmd has been completed
PrecmdSchema.methods.complete = function(cb) {
    this.status = true;
    this.save(cb);
};

mongoose.model('Precmd', PrecmdSchema);