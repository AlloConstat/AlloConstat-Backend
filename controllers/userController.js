const User = require('../models/userModel');
const ResponseModels = require('../models/responseModels');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: users });
    } catch (err) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: user });
    } catch (err) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};

exports.updateUser = async (req, res) => {
    try {
        console.log('ceci le user :',req.body);
        const { nom, prenom, email, mot_de_passe, telephone, region, role } = req.body;
        const user = await User.findById(req.params.id);
    
        if (!user) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);

        user.nom = nom || user.nom;
        user.prenom = prenom || user.prenom;
        user.email = email || user.email;
        user.telephone = telephone || user.telephone;
        user.region = region || user.region;
        user.role = role || user.role;
        user.mot_de_passe = mot_de_passe || user.mot_de_passe;

        const updatedUser = await user.save();
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: updatedUser });
    } catch (err) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: user });
    } catch (err) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
    }
};
