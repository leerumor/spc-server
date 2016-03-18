/**
 * Created by rumeili on 16/3/15.
 */
var mongoose = require('mongoose');

var DispoSchema = new mongoose.Schema({
    lundiDate: Date,
    lundi: {type: Boolean, default: false},
    mardi: {type: Boolean, default: false},
    mercredi: {type: Boolean, default: false},
    jeudi: {type: Boolean, default: false},
    vendredi: {type: Boolean, default: false},
    samedi: {type: Boolean, default: false},
    plat: { type: mongoose.Schema.Types.ObjectId, ref: 'Plat' }
});

mongoose.model('Dispo', DispoSchema);