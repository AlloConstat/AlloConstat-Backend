const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    nom: { type: String, enum: ['A', 'B'], required: true },
    // Autres champs si nécessaires
});

const constatSchema = new mongoose.Schema({
    lieu: String,
    pdfUrls: {
        simple: String,
        duplicata: String,
    },
    timestamp: { type: Date, default: Date.now },
    nbrVehicles: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Constats', constatSchema);
