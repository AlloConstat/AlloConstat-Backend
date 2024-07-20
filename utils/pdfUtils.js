const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

async function fillPDF(templatePath, outputPath, formData) {
    try {
        const existingPdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Register fontkit
        pdfDoc.registerFontkit(fontkit);

        // Load custom font
        const customFontPath = path.join(__dirname, 'Arial.ttf');
        const customFontBytes = fs.readFileSync(customFontPath);
        const customFont = await pdfDoc.embedFont(customFontBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const positions = {
            dateAccident: { x: 50, y: 720 },
            lieu: { x: 180, y: 720 },
            blesses: { x: 480, y: 720 },
            degatsMateriels: { x: 80, y: 685 },
            temoins: { x: 180, y: 685 },
            vehicles: {
                A: {
                    nom: { x: 50, y: 600 },
                    marque: { x: 100, y: 350 },
                    numeroImmatriculation: { x: 120, y: 332 },
                    degatsApparents: { x: 50, y: 570 },
                    observations: { x: 50, y: 1410 },
                    sensSuiviVenants: { x: 80, y: 300 },
                    sensSuiviAllants: { x: 80, y: 285 }
                },
                B: {
                    nom: { x: 50, y: 450 },
                    marque: { x: 150, y: 200 },
                    numeroImmatriculation: { x: 250, y: 450 },
                    degatsApparents: { x: 50, y: 420 },
                    observations: { x: 50, y: 390 },
                    sensSuiviVenants: { x: 50, y: 360 },
                    sensSuiviAllants: { x: 150, y: 360 }
                }
            }
        };

        const textStyle = {
            size: 10, // Smaller font size
            font: customFont, // Use custom font
            color: rgb(0, 0, 1), // Blue color
        };

        firstPage.drawText(formData.date_accident, {
            x: positions.dateAccident.x,
            y: positions.dateAccident.y,
            ...textStyle
        });

        firstPage.drawText(formData.lieu, {
            x: positions.lieu.x,
            y: positions.lieu.y,
            ...textStyle
        });

        firstPage.drawText(formData.blesses ? 'Oui' : 'Non', {
            x: positions.blesses.x,
            y: positions.blesses.y,
            ...textStyle
        });

        firstPage.drawText(formData.degats_materiels ? 'Oui' : 'Non', {
            x: positions.degatsMateriels.x,
            y: positions.degatsMateriels.y,
            ...textStyle
        });

        // Draw temoins
        formData.temoins.forEach((temoin, index) => {
            const temoinYPosition = positions.temoins.y - (index * 15);
            firstPage.drawText(`Nom: ${temoin.nom}, Adresse: ${temoin.adresse}, Téléphone: ${temoin.telephone}`, {
                x: positions.temoins.x,
                y: temoinYPosition,
                ...textStyle
            });
        });

        // Draw vehicles
        formData.vehicles.forEach((vehicle) => {
            const vehiclePositions = positions.vehicles[vehicle.nom];
            if (vehiclePositions) {
                firstPage.drawText(vehicle.nom, {
                    x: vehiclePositions.nom.x,
                    y: vehiclePositions.nom.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.marque, {
                    x: vehiclePositions.marque.x,
                    y: vehiclePositions.marque.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.numero_immatriculation, {
                    x: vehiclePositions.numeroImmatriculation.x,
                    y: vehiclePositions.numeroImmatriculation.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.degats_apparents, {
                    x: vehiclePositions.degatsApparents.x,
                    y: vehiclePositions.degatsApparents.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.observations, {
                    x: vehiclePositions.observations.x,
                    y: vehiclePositions.observations.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.sens_suivi_venant, {
                    x: vehiclePositions.sensSuiviVenants.x,
                    y: vehiclePositions.sensSuiviVenants.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.sens_suivi_allant, {
                    x: vehiclePositions.sensSuiviAllants.x,
                    y: vehiclePositions.sensSuiviAllants.y,
                    ...textStyle
                });
            }
        });

        // Save modified PDF
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
    } catch (error) {
        console.error(`Error generating PDF: ${error.message}`);
        throw error; // Re-throw the error to be caught in the controller
    }
}

module.exports = { fillPDF };
