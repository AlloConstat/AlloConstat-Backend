const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    nom: { type: String, enum: ['A', 'B'], required: true },
    // Autres champs si nécessaires
});

const constatSchema = new mongoose.Schema({
    region: String,
    pdfUrls: {
        simple: String,
        duplicata: String,
    },
    timestamp: { type: Date, default: Date.now },
    nbrVehicles: { type: Number, default: 1 },
    matriculeA: { type: String },
    matriculeB: { type: String },
    vehicleType: {type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

module.exports = mongoose.model('Constats', constatSchema);
