/**
 * Created by rumeili on 16/3/19.
 */
var mongoose = require('mongoose');

var PrecmdSchema = new mongoose.Schema({
    date: String,
    restaurant:String,
    horaire: String,
    username: String,
    nCommande: String,
    annulation: {type: Boolean, default: false},
    preparation: {type: Boolean, default: false},
    retrait: {type: Boolean, default: false},
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }]
});

//when the precmd has been completed
PrecmdSchema.methods.complete = function(cb) {
    this.status = true;
    this.save(cb);
};

mongoose.model('Precmd', PrecmdSchema);