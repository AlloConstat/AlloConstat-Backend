const mongoose = require('mongoose');
const { Schema } = mongoose;

const TemoinSchema = new Schema({
  nom: { type: String, required: true },
  adresse: { type: String, required: true },
  telephone: { type: String, required: true },
  bateau: { type: String, required: true }
});

const PhotoSchema = new Schema({
  url: { type: String },
  description: { type: String}
});

const AssuranceSchema = new Schema({
  nom: { type: String, required: true },
  numero_assurance: { type: String, required: true },
  localisation: { type: String, required: true },
  dommages: { type: String, required: true }
});

const PiloteSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  adresse: { type: String, required: true },
  categorie: { type: String, required: true },
  par: { type: String, required: true },
  numero_permis: { type: String, required: true },
  date_delivration: { type: Date, required: true }
});

const AssureSchema = new Schema({
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  adresse: { type: String, required: true }
});

const PointDeChocInitialSchema = new Schema({
  url: { type: String, required: true }
});

const BateauSchema = new Schema({
  nom: { type: String, required: true },
  marque: { type: String, required: true },
  jetski_planche: { type: String, required: true },
  numero_immatriculation: { type: String, required: true },
  degats_apparents: { type: String, required: true },
  observations: { type: String, required: true },
  type: { type: String, required: true },
  annee: { type: String, required: true },
  point_de_choc_initial: { type: PointDeChocInitialSchema, required: true },
  photos: [PhotoSchema],
  assurance: { type: AssuranceSchema, required: true },
  pilote: { type: PiloteSchema, required: true },
  assure: { type: AssureSchema, required: true },
  circonstances: [{ type: String }],
  nbr_de_choix: { type: Number, required: true }
});

const ConstatBateauSchema = new Schema({
  vehicleType: { type: String, default: 'boat' },
  date_accident: { type: Date, required: true },
  heure_accident: { type: String, required: true },
  lieu: { type: String, required: true },
  blesses: { type: Boolean, required: true },
  type: { type: Boolean, required: true },
  temoins: [TemoinSchema],
  bateaux: [BateauSchema]
});

const ConstatBateau = mongoose.model('ConstatBateau', ConstatBateauSchema);

module.exports = ConstatBateau;
