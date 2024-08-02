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

       // console.log("\nformdata",formData.vehicles)

        // Load custom font (Arial)
        const customFontPath = path.join(__dirname, 'Arial.ttf');
        const customFontBytes = fs.readFileSync(customFontPath);
        const customFont = await pdfDoc.embedFont(customFontBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const secondPage = pages.length > 1 ? pages[1] : pdfDoc.addPage();


        const positions = {
            dateAccident: { x: 50, y: 720 },
            heure_accident: { x: 135, y: 720 },
            lieu: { x: 180, y: 720 },
            blesses: { 
                yes: { x: 535, y: 721 }, // Position for "Oui"
                no: { x: 458, y: 721 }   // Position for "Non"
            }, 
            degats_materiels: { 
                yes: { x: 136, y: 687 }, // Position for "Oui"
                no: { x: 65, y: 687 }   // Position for "Non"
            },
            temoins: { x: 180, y: 685 },
            vehicles: {
                A: {
                   // nom: { x: 50, y: 600 },
                    marque: { x: 91, y: 349 },
                    numeroImmatriculation: { x: 120, y: 332 },
                    degatsApparents: { x: 30, y: 134 },
                    observations: { x: 30, y: 100 },
                    sensSuiviVenants: { x: 72, y: 300 },
                    sensSuiviAllants: { x: 65, y: 284 },
                    // pointDeChocInitial: { x: 28, y: 216 },
                    photos: { x: 450, y: 360 },
                    assurance: {
                        nom: { x: 110, y: 632 },
                        numeroAssurance: { x: 118, y: 615 },
                        localisation: { x: 60, y: 598 },
                        date_validiteDebut: { x: 140, y: 565 },
                        date_validiteFin: { x: 50, y: 565 },
                    },
                    conducteur: {
                        nom: { x: 55, y: 537 },
                        prenom: { x: 64, y: 520 },
                        adresse: { x: 64, y: 503 },
                        numeroPermis: { x: 130, y: 487 },
                        dateDelivration: { x: 80, y: 470 },
                    },
                    assure: {
                        nom: { x: 54, y: 433 },
                        prenom: { x: 64, y: 416 },
                        adresse: { x: 70, y: 400 },
                        tel: { x: 160, y: 383 },
                    },
                    circonstances: { x: 218, y: 620 },
                    nbr_de_choix: {x: 216, y: 273 }
                },
                B: {
                   // nom: { x: 400, y: 598 },
                    marque: { x: 450, y: 349 },
                    numeroImmatriculation: { x: 470, y: 332 },
                    degatsApparents: { x: 440, y: 130 },
                    observations: { x: 310, y: 100 },
                    sensSuiviVenants: { x: 425, y: 300 },
                    sensSuiviAllants: { x: 415, y: 284 },
                   // pointDeChocInitial: { x: 433, y: 220 },
                    photos: { x: 450, y: 210 },
                    assurance: {
                        nom: { x: 462, y: 632 },
                        numeroAssurance: { x: 468, y: 615 },
                        localisation: { x: 415, y: 598 },
                        date_validiteDebut: { x: 420, y: 565 },
                        date_validiteFin: { x: 490, y: 565 },
                    },
                    conducteur: {
                        nom: { x: 405, y: 537 },
                        prenom: { x: 418, y: 520 },
                        adresse: { x: 418, y: 503 },
                        numeroPermis: { x: 480, y: 487 },
                        dateDelivration: { x: 440, y: 470 },
                    },
                    assure: {
                        nom: { x: 405, y: 433 },
                        prenom: { x: 416, y: 416 },
                        adresse: { x: 420, y: 400 },
                        tel: { x: 510, y: 383 },
                    },
                    circonstances: { x: 372, y: 620 },
                    nbr_de_choix: {x: 370, y: 273 }
                }
            }
        };

        const textStyle = {
            size: 9, // Smaller font size
            font: customFont, // Use custom font
            color: rgb(0, 0, 1), // Blue color
        };

        firstPage.drawText(formData.date_accident, {
            x: positions.dateAccident.x,
            y: positions.dateAccident.y,
            ...textStyle
        });

        firstPage.drawText(formData.heure_accident, {
            x: positions.heure_accident.x,
            y: positions.heure_accident.y,
            ...textStyle
        });

        firstPage.drawText(formData.lieu, {
            x: positions.lieu.x,
            y: positions.lieu.y,
            ...textStyle
        });

        // Determine position for blesses based on value
        const blessesPosition = formData.blesses ? positions.blesses.yes : positions.blesses.no;
        firstPage.drawText('x', {
            x: blessesPosition.x,
            y: blessesPosition.y,
            ...textStyle
        });

        
        // Determine position for degats_materiels based on value
        const degats_materiels = formData.degats_materiels ? positions.degats_materiels.yes : positions.degats_materiels.no;
        firstPage.drawText('x', {
            x: degats_materiels.x,
            y: degats_materiels.y,
            ...textStyle
        });

        // Draw temoins
      /*  formData.temoins.forEach((temoin, index) => {
            const temoinYPosition = positions.temoins.y - (index * 15);
            firstPage.drawText(`Nom: ${temoin.nom}, Adresse: ${temoin.adresse}, Téléphone: ${temoin.telephone}`, {
                x: positions.temoins.x,
                y: temoinYPosition,
                ...textStyle
            });
        });*/


        const drawsPhotos = async (photo, posX, posY) => {
            try {
                // Remove the base64 data URL prefix
                const base64Data = photo.split(',')[1]; // Assumes the format is "data:image/png;base64,<base64_data>"
        
                const photoBytes = Buffer.from(base64Data, 'base64');
        
                // Embed the PNG image
                const embeddedPhoto = await pdfDoc.embedPng(photoBytes);
        
                // Draw image on the second page
                secondPage.drawImage(embeddedPhoto, {
                    x: posX,
                    y: posY,
                    width: 100,
                    height: 100,
                });
        
                console.log('Photo added successfully.');
            } catch (error) {
                console.error('Error drawing photos:', error);
            }
        };
        const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const addPhotos = async (vehicle, vehiclePositions) => {
            let posX = 80;
            let posY = 80;
        
            for (const photo of vehicle.photos) {
                for (const image of photo.images) {
                    await drawsPhotos(image, posX, posY);
                    posX += 80;
                    posY += 80;
                  
                }
            }
            console.log('All photos processed successfully.');
        };

        // Draw vehicles
        for (const vehicle of formData.vehicles) {
            const vehiclePositions = positions.vehicles[vehicle.nom];
           

         

            

            if (vehiclePositions) {

                addPhotos(vehicle, vehiclePositions).then(() => {
                    console.log('Photos added for vehicle:', vehicle.nom);
                });

                firstPage.drawText(vehicle.marque, {
                    x: vehiclePositions.marque.x,
                    y: vehiclePositions.marque.y,
                    ...textStyle
                });

// Draw photos


                firstPage.drawText(vehicle.numero_immatriculation, {
                    x: vehiclePositions.numeroImmatriculation.x,
                    y: vehiclePositions.numeroImmatriculation.y,
                    ...textStyle
                });

                   // Split degatsApparents into two lines
                   const degatsApparentsLines = splitTextIntoLines(vehicle.degats_apparents, 30);
                   const lineHeights = 7; // Adjust as needed for spacing
   
                   degatsApparentsLines.forEach((line, index) => {
                       firstPage.drawText(line, {
                           x: vehiclePositions.degatsApparents.x,
                           y: vehiclePositions.degatsApparents.y - (index * lineHeights),
                           ...textStyle
                       });
                   });


                   const observationsLines = splitTextIntoLines(vehicle.observations, 60);
                   const lineHeightss = 7; // Adjust as needed for spacing
   
                   observationsLines.forEach((line, index) => {
                       firstPage.drawText(line, {
                           x: vehiclePositions.observations.x,
                           y: vehiclePositions.observations.y - (index * lineHeights),
                           ...textStyle
                       });
                   });
              

                

                        console.log('nbr images', vehicle.photos[0].images.length)
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

             
                

                // Draw photos
                const photoPositions = vehiclePositions.photos;
                let photoIndex = 0;




                const totalCircumstances = 17;
                const circumstancesX = vehiclePositions.circonstances.x;
                const baseCircumstancesY = vehiclePositions.circonstances.y;
                const lineHeight = 20;
                const newLineHeight = 20.3;
                
                for (let i = 1; i <= totalCircumstances; i++) {
                    // Détermine le lineHeight à utiliser
                    const currentLineHeight = i >= 9 ? newLineHeight : lineHeight;
                    const yPosition = baseCircumstancesY - ((i - 1) * currentLineHeight);
                    const isCircumstancePresent = vehicle.circonstances.includes(i.toString());
                    const text = isCircumstancePresent ? 'x' : '';
                
                    firstPage.drawText(text, {
                        x: circumstancesX,
                        y: yPosition,
                        ...textStyle
                    });
                }
                

                // Draw Assurance
                firstPage.drawText(vehicle.assurance.nom, {
                    x: vehiclePositions.assurance.nom.x,
                    y: vehiclePositions.assurance.nom.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assurance.numero_assurance, {
                    x: vehiclePositions.assurance.numeroAssurance.x,
                    y: vehiclePositions.assurance.numeroAssurance.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assurance.localisation, {
                    x: vehiclePositions.assurance.localisation.x,
                    y: vehiclePositions.assurance.localisation.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assurance.date_validiteDebut, {
                    x: vehiclePositions.assurance.date_validiteDebut.x,
                    y: vehiclePositions.assurance.date_validiteDebut.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assurance.date_validiteFin, {
                    x: vehiclePositions.assurance.date_validiteFin.x,
                    y: vehiclePositions.assurance.date_validiteFin.y,
                    ...textStyle
                });

                // Draw Conducteur
                firstPage.drawText(vehicle.conducteur.nom, {
                    x: vehiclePositions.conducteur.nom.x,
                    y: vehiclePositions.conducteur.nom.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.conducteur.prenom, {
                    x: vehiclePositions.conducteur.prenom.x,
                    y: vehiclePositions.conducteur.prenom.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.conducteur.adresse, {
                    x: vehiclePositions.conducteur.adresse.x,
                    y: vehiclePositions.conducteur.adresse.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.conducteur.numero_permis, {
                    x: vehiclePositions.conducteur.numeroPermis.x,
                    y: vehiclePositions.conducteur.numeroPermis.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.conducteur.date_delivration, {
                    x: vehiclePositions.conducteur.dateDelivration.x,
                    y: vehiclePositions.conducteur.dateDelivration.y,
                    ...textStyle
                });

                // Draw Assure
                firstPage.drawText(vehicle.assure.nom, {
                    x: vehiclePositions.assure.nom.x,
                    y: vehiclePositions.assure.nom.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assure.prenom, {
                    x: vehiclePositions.assure.prenom.x,
                    y: vehiclePositions.assure.prenom.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assure.adresse, {
                    x: vehiclePositions.assure.adresse.x,
                    y: vehiclePositions.assure.adresse.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.nbr_de_choix, {
                    x: vehiclePositions.nbr_de_choix.x,
                    y: vehiclePositions.nbr_de_choix.y,
                    ...textStyle
                });

                firstPage.drawText(vehicle.assure.tel, {
                    x: vehiclePositions.assure.tel.x,
                    y: vehiclePositions.assure.tel.y,
                    ...textStyle
                });
            }
        };
        await wait(14000);

        // Save the filled PDF
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);

        console.log('PDF filled and saved successfully!');
    } catch (error) {
        console.error('Error filling the PDF:', error);
    }
}


async function addDuplicataImage(inputPath, outputPath) {
    try {
        const existingPdfBytes = fs.readFileSync(inputPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        const duplicataImagePath = path.join(__dirname, '../utils/duplicata.png');
        const duplicataImageBytes = fs.readFileSync(duplicataImagePath);
        const duplicataImage = await pdfDoc.embedPng(duplicataImageBytes);

        const pages = pdfDoc.getPages();

        pages.forEach((page) => {
            page.drawImage(duplicataImage, {
                x: page.getWidth() - duplicataImage.width +40,
                y: 400,
                width: duplicataImage.width,
                height: duplicataImage.height,
            });
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);

        console.log('Duplicata PDF filled and saved successfully!');
    } catch (error) {
        console.error('Error adding duplicata image to PDF:', error);
    }
}

function splitTextIntoLines(text, maxLength) {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach(word => {
        if ((currentLine + word).length <= maxLength) {
            currentLine += `${word} `;
        } else {
            lines.push(currentLine.trim());
            currentLine = `${word} `;
        }
    });

    if (currentLine) {
        lines.push(currentLine.trim());
    }

    return lines;
}

module.exports = { fillPDF, addDuplicataImage };


