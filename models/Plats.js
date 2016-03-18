/**
 * Created by rumeili on 16/3/15.
 */
var mongoose = require('mongoose');

var PlatSchema = new mongoose.Schema({
    title: String,
    description: String,
    upvotes: {type: Number, default: 0},
    image: String,
    type: String,
    dispos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dispo' }]
});

PlatSchema.methods.upvote = function(cb) {
    this.upvotes += 1;
    this.save(cb);
};

mongoose.model('Plat', PlatSchema);