const path = require('path');
const fs = require('fs');
const { fillPDF, addDuplicataImage } = require('../utils/pdfUtils'); // Correct import
const Constat = require('../models/constatModel');
const ResponseModels = require('../models/responseModels');
const { uploadFile } = require('../utils/googleDrive');

exports.createConstat = async (req, res) => {
    try {
        const newConstat = new Constat(req.body);
        await newConstat.save();

        const templatePath = path.join(__dirname, '../utils/template.pdf');
        const outputPathSimple = path.join(__dirname, `../output/constat_${newConstat._id}.pdf`);
        const outputPathDuplicata = path.join(__dirname, `../output/constat_${newConstat._id}_duplicata.pdf`);

        console.log(`Template path: ${templatePath}`);
        console.log(`Output path (simple): ${outputPathSimple}`);
        console.log(`Output path (duplicata): ${outputPathDuplicata}`);

        await fillPDF(templatePath, outputPathSimple, req.body);

        if (fs.existsSync(outputPathSimple)) {
            console.log(`Simple PDF successfully created at ${outputPathSimple}`);
        } else {
            console.log(`Simple PDF creation failed.`);
        }

        // Create duplicata PDF
        await addDuplicataImage(outputPathSimple, outputPathDuplicata);

        if (fs.existsSync(outputPathDuplicata)) {
            console.log(`Duplicata PDF successfully created at ${outputPathDuplicata}`);
        } else {
            console.log(`Duplicata PDF creation failed.`);
        }

        // Upload files to Google Drive
        const simplePdfUrl = await uploadFile(outputPathSimple, `constat_${newConstat._id}.pdf`);
        const duplicataPdfUrl = await uploadFile(outputPathDuplicata, `constat_${newConstat._id}_duplicata.pdf`);

        // Save URLs and timestamp in the database
        newConstat.pdfUrls = {
            simple: simplePdfUrl,
            duplicata: duplicataPdfUrl,
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
