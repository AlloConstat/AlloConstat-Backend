const mongoose = require('mongoose');

const temoinsSchema = new mongoose.Schema({
    nom: String,
    adresse: String,
    telephone: String,
});

const driverSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    adresse: String,
    numero_permis: String,
    date_delivration: Date,
});

const insuranceSchema = new mongoose.Schema({
    nom: String,
    numero_assurance: String,
    localisation: String,
    date_validite: Date,
});

const photoSchema = new mongoose.Schema({
    url: String,
    description: String,
});

const vehicleSchema = new mongoose.Schema({
    nom: { type: String, enum: ['A', 'B'], required: true },
    marque: String,
    numero_immatriculation: String,
    degats_apparents: String,
    observations: String,
    sens_suivi_venant: String,
    sens_suivi_allant: String,
    point_de_choc_initial: photoSchema,
    photos: [photoSchema],
    assurance: insuranceSchema,
    conducteur: driverSchema,
    circonstances: [String],
});

const constatSchema = new mongoose.Schema({
    date_accident: { type: Date, required: true },
    lieu: { type: String, required: true },
    blesses: { type: Boolean, required: true },
    degats_materiels: { type: Boolean, required: true },
    temoins: [temoinsSchema],
    vehicles: [vehicleSchema],
});

module.exports = mongoose.model('Constat', constatSchema);
