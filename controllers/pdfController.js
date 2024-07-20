const path = require('path');
const fs = require('fs');
const { fillPDF } = require('../utils/pdfUtils'); // Correct import
const Constat = require('../models/constatModel');
const ResponseModels = require('../models/responseModels');

exports.createConstat = async (req, res) => {
    try {
        const newConstat = new Constat(req.body);
        await newConstat.save();

        const templatePath = path.join(__dirname, '../template.pdf');
        const outputPath = path.join(__dirname, `../output/constat_${newConstat._id}.pdf`);

        console.log(`Template path: ${templatePath}`);
        console.log(`Output path: ${outputPath}`);

        await fillPDF(templatePath, outputPath, req.body);

        if (fs.existsSync(outputPath)) {
            console.log(`PDF successfully created at ${outputPath}`);
        } else {
            console.log(`PDF creation failed.`);
        }

        res.status(ResponseModels.CREATED.status).send({ ...ResponseModels.CREATED, data: newConstat });
    } catch (error) {
        console.error(`Error: ${error.message}`);
        res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send({ ...ResponseModels.INTERNAL_SERVER_ERROR, message: error.message });
    }
};
