const Constat = require('../models/constatModel');
const ResponseModels = require('../models/responseModels');

// Create Constat
exports.createConstat = async (req, res) => {
    try {
        console.log('le contsat',req.body);
        const newConstat = new Constat(req.body);
        await newConstat.save();
        res.status(ResponseModels.CREATED.status).send({ ...ResponseModels.CREATED, data: newConstat });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

// Get All Constats
exports.getAllConstats = async (req, res) => {
    try {
        const constats = await Constat.find();
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: constats });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

// Get Constat by ID
exports.getConstatById = async (req, res) => {
    try {
        const constat = await Constat.findById(req.params.id);
        if (!constat) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: constat });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

// Update Constat
exports.updateConstat = async (req, res) => {
    try {
        const constat = await Constat.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!constat) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: constat });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};

// Delete Constat
exports.deleteConstat = async (req, res) => {
    try {
        const constat = await Constat.findByIdAndDelete(req.params.id);
        if (!constat) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
        res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, message: 'Constat deleted successfully' });
    } catch (error) {
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};
