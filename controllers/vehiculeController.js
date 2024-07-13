const Constat = require('../models/constatModel');
const ResponseModels = require('../models/responseModels');

exports.getAllVehicules = async (req, res) => {
    try {
        const constats = await Constat.find();
        const vehicules = constats.flatMap(constat => constat.vehicles);

        res.status(ResponseModels.SUCCESS.status).send({
            ...ResponseModels.SUCCESS,
            data: vehicules,
        });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({
            ...ResponseModels.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};

exports.getVehiculeById = async (req, res) => {
    try {
        const { id } = req.params;
        const constats = await Constat.find();
        const vehicule = constats.flatMap(constat => constat.vehicles).find(vehicle => vehicle._id.toString() === id);

        if (!vehicule) {
            return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
        }

        res.status(ResponseModels.SUCCESS.status).send({
            ...ResponseModels.SUCCESS,
            data: vehicule,
        });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({
            ...ResponseModels.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};
