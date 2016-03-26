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
    retrait: {type: Boolean, default: false},
    annulation: {type: Boolean, default: false},
    preparation: {type: Boolean, default: false},
    reservations: [{
        nCasier:String,
        typePlat: String,
        peri1: String,
        peri2: String,
        peri3: String,
        peri4: String,
        boisson: String
    }]
});

//when the precmd has been prepared
PrecmdSchema.methods.preparer = function(cb) {
    this.preparation = true;
    this.save(cb);
};

//annulation
PrecmdSchema.methods.annuler = function(cb) {
    this.annulation = true;
    this.save(cb);
};

//when the precmd has been prepared
PrecmdSchema.methods.retraire = function(cb) {
    this.retrait = true;
    this.save(cb);
};

mongoose.model('Precmd', PrecmdSchema);