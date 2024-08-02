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

        console.log('\ntype',constatData.report.vehicleType)

        console.log('\n', constatData )
        console.log('\n',constatData.report.vehicles)
        if (constatData.report.vehicleType === 'car') {
            
            newConstat = new Constat({
                userId,
                lieu : constatData.report.lieu,
                timestamp: new Date(),
                nbrVehicles: constatData.report.vehicles.length,
            });
        } else if (constatData.report.vehicleType === 'boat') {
            newConstat = new ConstatBateau({
                userId,
                lieu: constatData.report.lieu,
                timestamp: new Date(),
                nbrbateaux : constatData.report.bateaux.length,
            });
        } else {

            return res.status(ResponseModels.BAD_REQUEST.status).send({ ...ResponseModels.BAD_REQUEST, message: 'Invalid vehicle type' });
        }
console.log('\n new constat',newConstat)
        await newConstat.save();

        let templatePath;
        let outputPathSimple;
        let outputPathDuplicata;

        if (constatData.report.vehicleType === 'car') {
            templatePath = path.join( __dirname,'../utils/template.pdf');
            outputPathSimple = path.join( __dirname,`../output/voitures/constat_${newConstat._id}.pdf`);
            outputPathDuplicata = path.join(__dirname,`../output/voitures/constat_${newConstat._id}_duplicata.pdf`);
            await fillPDF(templatePath, outputPathSimple, constatData.report);
        } else if (constatData.report.vehicleType === 'boat') {
            templatePath = path.join( __dirname,'../utils/template_bateau.pdf');
            outputPathSimple = path.join(__dirname, `../output/bateaux/constat_bateau_${newConstat._id}.pdf`);
            outputPathDuplicata = path.join(__dirname, `../output/bateaux/constat_bateau_${newConstat._id}_duplicata.pdf`);
            await fillPDFBoat(templatePath, outputPathSimple, constatData);
        }
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        //await addDuplicataImage(outputPathSimple, outputPathDuplicata);
        await wait(13000);
        newConstat.pdfUrls = {
            simple: outputPathSimple,
            duplicata: outputPathDuplicata,
        };
        console.log('new constat ',newConstat)

        await newConstat.save();

        res.status(ResponseModels.CREATED.status).send({ ...ResponseModels.CREATED, data: newConstat });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};
