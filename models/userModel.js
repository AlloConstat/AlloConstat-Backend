const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    mot_de_passe: { type: String, required: true },
    telephone: { type: String, required: true },
    region: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'superAdmin'], default: 'user' },
});

UserSchema.pre('save', function (next) {
    if (!this.isModified('mot_de_passe')) return next();
    this.mot_de_passe = bcrypt.hashSync(this.mot_de_passe, 8);
    next();
});

UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.mot_de_passe);
};

module.exports = mongoose.model('User', UserSchema);
