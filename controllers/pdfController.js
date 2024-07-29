const path = require('path');
const fs = require('fs');
const { fillPDF, addDuplicataImage } = require('../utils/pdfUtils');
const { fillPDFBoat } = require('../utils/pdfUtilsBoat.js');
const Constat = require('../models/constatModel');
const ConstatBateau = require('../models/bateauModels'); // Import du modèle ConstatBateau
const ResponseModels = require('../models/responseModels');

exports.createConstat = async (req, res) => {
    try {
        const { vehicleType, ...constatData } = req.body;
        const newConstat = new Constat(constatData);
        await newConstat.save();

        let templatePath;
        let outputPathSimple;
        let outputPathDuplicata;

        if (vehicleType === 'car') {
            templatePath = path.join(__dirname, '../utils/template.pdf');
            outputPathSimple = path.join(__dirname, `../output/voitures/constat_${newConstat._id}.pdf`);
            outputPathDuplicata = path.join(__dirname, `../output/voitures/constat_${newConstat._id}_duplicata.pdf`);
            await fillPDF(templatePath, outputPathSimple, constatData);
        } else if (vehicleType === 'boat') {
            let accidentDoc;
            accidentDoc = new ConstatBateau(constatData);
            await accidentDoc.save();
            templatePath = path.join(__dirname, '../utils/template_bateau.pdf');
            outputPathSimple = path.join(__dirname, `../output/bateaux/constat_bateau_${newConstat._id}.pdf`);
            outputPathDuplicata = path.join(__dirname, `../output/bateaux/constat_bateau_${newConstat._id}_duplicata.pdf`);
            await fillPDFBoat(templatePath, outputPathSimple, constatData);
        } else {
            return res.status(ResponseModels.BAD_REQUEST.status).send({ ...ResponseModels.BAD_REQUEST, message: 'Invalid vehicle type' });
        }

        if (fs.existsSync(outputPathSimple)) {
            console.log(`Simple PDF successfully created at ${outputPathSimple}`);
        } else {
            console.log(`Simple PDF creation failed.`);
        }

        await addDuplicataImage(outputPathSimple, outputPathDuplicata);

        if (fs.existsSync(outputPathDuplicata)) {
            console.log(`Duplicata PDF successfully created at ${outputPathDuplicata}`);
        } else {
            console.log(`Duplicata PDF creation failed.`);
        }

        // Enregistrer seulement les fichiers PDF localement
        newConstat.pdfUrls = {
            simple: outputPathSimple,
            duplicata: outputPathDuplicata,
        };
        newConstat.createdAt = new Date();
        newConstat.timestamp = Date.now();
        await newConstat.save();

        res.status(ResponseModels.CREATED.status).send({ ...ResponseModels.CREATED, data: newConstat });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};




// const path = require('path');
// const fs = require('fs');
// const { fillPDF, addDuplicataImage } = require('../utils/pdfUtils');
// const { fillPDFBoat } = require('../utils/pdfUtilsBoat.js');
// const Constat = require('../models/constatModel');
// const ConstatBateau = require('../models/bateauModels'); // Import du modèle ConstatBateau
// const ResponseModels = require('../models/responseModels');

// exports.createConstat = async (req, res) => {
//     try {
//         const { vehicleType, ...constatData } = req.body;

//         let accidentDoc;

//         if (vehicleType === 'boat') {
//             accidentDoc = new ConstatBateau(constatData);
//             await accidentDoc.save();
//         } else {
//             return res.status(ResponseModels.BAD_REQUEST.status).send({ ...ResponseModels.BAD_REQUEST, message: 'Invalid vehicle type' });
//         }

//         const newConstat = new Constat({
//             ...constatData,
//             accidentRef: accidentDoc._id, // Lien vers le document ConstatBateau
//             vehicleType
//         });
//         await newConstat.save();

//         let templatePath;
//         let outputPathSimple;
//         let outputPathDuplicata;

//         if (vehicleType === 'boat') {
//             templatePath = path.join(__dirname, '../utils/template_bateau.pdf');
//             outputPathSimple = path.join(__dirname, `../output/constat_bateau_${newConstat._id}.pdf`);
//             outputPathDuplicata = path.join(__dirname, `../output/constat_bateau_${newConstat._id}_duplicata.pdf`);
//             await fillPDFBoat(templatePath, outputPathSimple, constatData);
//         } else {
//             return res.status(ResponseModels.BAD_REQUEST.status).send({ ...ResponseModels.BAD_REQUEST, message: 'Invalid vehicle type' });
//         }

//         if (fs.existsSync(outputPathSimple)) {
//             console.log(`Simple PDF successfully created at ${outputPathSimple}`);
//         } else {
//             console.log(`Simple PDF creation failed.`);
//         }

//         await addDuplicataImage(outputPathSimple, outputPathDuplicata);

//         if (fs.existsSync(outputPathDuplicata)) {
//             console.log(`Duplicata PDF successfully created at ${outputPathDuplicata}`);
//         } else {
//             console.log(`Duplicata PDF creation failed.`);
//         }

//         newConstat.pdfUrls = {
//             simple: `local_path_to_pdfs/constat_bateau_${newConstat._id}.pdf`,
//             duplicata: `local_path_to_pdfs/constat_bateau_${newConstat._id}_duplicata.pdf`,
//         };
//         newConstat.createdAt = new Date();
//         newConstat.timestamp = Date.now();
//         await newConstat.save();

//         res.status(ResponseModels.CREATED.status).send({ ...ResponseModels.CREATED, data: newConstat });
//     } catch (error) {
//         console.error(`Error: ${error.message}`);
//         res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
//     }
// };
