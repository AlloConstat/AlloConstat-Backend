const path = require('path');
const fs = require('fs');
const { fillPDF, addDuplicataImage } = require('../utils/pdfUtils');
const { fillPDFBoat } = require('../utils/pdfUtilsBoat.js');
const Constat = require('../models/constatModel');
const ConstatBateau = require('../models/bateauModels'); 
const ResponseModels = require('../models/responseModels');

exports.createConstat = async (req, res) => {
    try {
        const { vehicleType, userId, ...constatData } = req.body;
        let newConstat;

        //console.log('\n', constatData )
        if (vehicleType === 'car') {
            newConstat = new Constat({
                userId,
                lieu : constatData.lieu,
                timestamp: new Date(),
                nbrVehicles: constatData.vehicles.length,
            });
        } else if (vehicleType === 'boat') {
            newConstat = new ConstatBateau({
                userId,
                lieu: constatData.lieu,
                timestamp: new Date(),
                nbrbateaux : constatData.bateaux.length,
            });
        } else {
            return res.status(ResponseModels.BAD_REQUEST.status).send({ ...ResponseModels.BAD_REQUEST, message: 'Invalid vehicle type' });
        }
console.log('\n',newConstat)
        await newConstat.save();

        let templatePath;
        let outputPathSimple;
        let outputPathDuplicata;

        if (vehicleType === 'car') {
            templatePath = path.join( __dirname,'../utils/template.pdf');
            outputPathSimple = path.join( __dirname,`../output/voitures/constat_${newConstat._id}.pdf`);
            outputPathDuplicata = path.join(__dirname,`../output/voitures/constat_${newConstat._id}_duplicata.pdf`);
            await fillPDF(templatePath, outputPathSimple, constatData);
        } else if (vehicleType === 'boat') {
            templatePath = path.join( __dirname,'../utils/template_bateau.pdf');
            outputPathSimple = path.join(__dirname, `../output/bateaux/constat_bateau_${newConstat._id}.pdf`);
            outputPathDuplicata = path.join(__dirname, `../output/bateaux/constat_bateau_${newConstat._id}_duplicata.pdf`);
            await fillPDFBoat(templatePath, outputPathSimple, constatData);
        }

        await addDuplicataImage(outputPathSimple, outputPathDuplicata);

        newConstat.pdfUrls = {
            simple: outputPathSimple,
            duplicata: outputPathDuplicata,
        };
        console.log(newConstat)

        await newConstat.save();

        res.status(ResponseModels.CREATED.status).send({ ...ResponseModels.CREATED, data: newConstat });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};


exports.getBoatConstats = async (req, res) => {
    try {
      const boatConstats = await ConstatBateau.find({ vehicleType: 'boat' }); // Exemple de filtre par type
      res.status(200).json(boatConstats);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des constats de bateaux' });
    }
  };
  
  exports.getCarConstats = async (req, res) => {
    try {
      const carConstats = await Constat.find({ vehicleType: 'car' }); // Exemple de filtre par type
      res.status(200).json(carConstats);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des constats de voitures' });
    }
  };
