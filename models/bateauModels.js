const mongoose = require('mongoose');
const { Schema } = mongoose;

const BateauSchema = new Schema({
    nom: { type: String, required: true },
    // Autres champs si nécessaires
});

const ConstatBateauSchema = new Schema({
    lieu: String,
    pdfUrls: {
        simple: String,
        duplicata: String,
    },
    timestamp: { type: Date, default: Date.now },
    nbrbateaux: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const ConstatBateau = mongoose.model('constatbateaus', ConstatBateauSchema);

module.exports = ConstatBateau;
