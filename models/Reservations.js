/**
 * Created by rumeili on 16/3/19.
 */
var mongoose = require('mongoose');

var ReservationSchema = new mongoose.Schema({
    typePlat: String,
    peri1: String,
    peri2: String,
    peri3: String,
    peri4: String,
    boisson: String,
    precmd: { type: mongoose.Schema.Types.ObjectId, ref: 'Precmd' }
});

mongoose.model('Reservation', ReservationSchema);