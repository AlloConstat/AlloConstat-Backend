const mongoose = require('mongoose');
const { Schema } = mongoose;

const BateauSchema = new Schema({
    nom: { type: String, required: true },
    // Autres champs si nécessaires
});

const ConstatBateauSchema = new Schema({
    region: String,
    pdfUrls: {
        simple: String,
        duplicata: String,
    },
    timestamp: { type: Date, default: Date.now },
    nbrbateaux: { type: Number, default: 1 },
    vehicleType: {type: String},
    userId: { type: String },
    bateauA: { type: String },
    bateauB: { type: String },
});

const ConstatBateau = mongoose.model('constatbateaus', ConstatBateauSchema);

module.exports = ConstatBateau;
