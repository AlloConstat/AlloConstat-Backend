const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const fontkit = require('@pdf-lib/fontkit');

async function fillPDFBoat(templatePath, outputPath, formData) {
    try {
        const existingPdfBytes = fs.readFileSync(templatePath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // Register fontkit
        pdfDoc.registerFontkit(fontkit);

        // Load custom font (Arial)
        const customFontPath = path.join(__dirname, 'Arial.ttf');
        const customFontBytes = fs.readFileSync(customFontPath);
        const customFont = await pdfDoc.embedFont(customFontBytes);

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const positions = {
            date_accident: { x: 420, y: 812},
            heure_accident: { x: 470, y: 812 },
            lieu: { x: 342, y: 786},
            blesses: { 
                yes: { x: 454, y: 742 }, // Position for "Oui"
                no: { x: 510, y: 742 }   // Position for "Non"
            }, 
            type: { 
                yes: { x: 454, y: 774 }, // Position for "Oui"
                no: { x: 520, y: 774 }   // Position for "Non"
            },
            // temoins: { x: 100, y: 7 },
            temoins: {
                nomTel: { x: 71, y: 756 },
                bateauAdresse: { x: 71, y: 744 }
            },
            bateaux: {
                A: {
                    marque: { x: 78, y: 536 },
                    numeroImmatriculation: { x: 125, y: 510 },
                    degatsApparents: { x: 40, y: 130 },
                    observations: { x: 40, y: 100 },
                    jetski_planche: { x: 415, y: 284 },
                    type: { x: 64, y: 523 },
                    annee: { x: 150, y: 523 },
                    pointDeChocInitial: { x: 28, y: 216 },
                   // photos: { x: 450, y: 360 },
                    assurance: {
                        nom: { x: 40, y: 440 },
                        numeroAssurance: { x: 90, y: 427 },
                        localisation: { x: 115, y: 414 },
                        dommages: { x: 140, y: 565 },
                    },
                    pilote: {
                        nom: { x: 90, y: 342 },
                        prenom: { x: 85, y: 329 },
                        adresse: { x: 40, y: 305 },
                        categorie: { x: 190, y: 277 },
                        par: { x: 95, y: 265 },
                        numero_permis: { x: 80, y: 470 },
                        date_delivration: { x: 150, y: 265 },
                    },
                    assure: {
                        nom: { x: 90, y: 634 },
                        prenom: { x: 78, y: 621 },
                        adresse: { x: 40, y: 595 },
                    },
                    circonstances: { x: 218, y: 620 },
                    nbr_de_choix: {x: 216, y: 273 }
                },
                B: {
                    marque: { x: 425, y: 536 },
                    numeroImmatriculation: { x: 480, y: 510 },
                    degatsApparents: { x: 440, y: 130 },
                    observations: { x: 315, y: 100 },
                    type: { x: 413, y: 523 },
                    annee: { x: 528, y: 523 },
                    jetski_planche: { x: 415, y: 284 },
                    pointDeChocInitial: { x: 433, y: 220 },
                   // photos: { x: 450, y: 210 },
                    assurance: {
                        nom: { x: 390, y: 440 },
                        numeroAssurance: { x: 445, y: 427 },
                        localisation: { x: 465, y: 414 },
                        dommages: { x: 490, y: 565 },
                    },
                    pilote: {
                        nom: { x: 438, y: 342 },
                        prenom: { x: 430, y: 330 },
                        adresse: { x: 390, y: 308 },
                        categorie: { x: 540, y: 282 },
                        par: { x: 445, y: 268 },
                        numero_permis: { x: 80, y: 470 },
                        date_delivration: { x: 525, y: 268 },
                    },
                    assure: {
                        nom: { x: 442, y: 634 },
                        prenom: { x: 430, y: 621 },
                        adresse: { x: 390, y: 595 },
                        
                    },
                    circonstances: { x: 372, y: 620 },
                    nbr_de_choix: {x: 370, y: 273 }
                }
            }
        };

        const textStyle = {
            size: 9, // Smaller font size
            font: customFont, // Use custom font
            color: rgb(0, 0, 0), // Blue color
        };

 

        firstPage.drawText(formData.date_accident, {
            x: positions.date_accident.x,
            y: positions.date_accident.y,
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
        const typePosition = formData.type ? positions.type.yes : positions.type.no;
        firstPage.drawText('x', {
            x: typePosition.x,
            y: typePosition.y,
            ...textStyle
        });
        
        // Determine position for blesses based on value
        const blessesPosition = formData.blesses ? positions.blesses.yes : positions.blesses.no;
        firstPage.drawText('x', {
            x: blessesPosition.x,
            y: blessesPosition.y,
            ...textStyle
        });

  // Draw temoins (Name & Telephone)
  formData.temoins.forEach((temoin, index) => {
    const nomTelYPosition = positions.temoins.nomTel.y - (index * 15);
    const bateauAdresseYPosition = positions.temoins.bateauAdresse.y - (index * 15);

    firstPage.drawText(`Nom: ${temoin.nom}, Téléphone: ${temoin.telephone}`, {
        x: positions.temoins.nomTel.x,
        y: nomTelYPosition,
        ...textStyle
    });

    firstPage.drawText(`Bateau: ${temoin.bateau}, Adresse: ${temoin.adresse}`, {
        x: positions.temoins.bateauAdresse.x,
        y: bateauAdresseYPosition,
        ...textStyle
    });
});

        // Draw bateaux
        formData.bateaux.forEach(async (bateau) => {
            const bateauPositions = positions.bateaux[bateau.nom];
            if (bateauPositions) {
                firstPage.drawText(bateau.marque, {
                    x: bateauPositions.marque.x,
                    y: bateauPositions.marque.y,
                    ...textStyle
                });

                firstPage.drawText(bateau.jetski_planche, {
                    x: bateauPositions.jetski_planche.x,
                    y: bateauPositions.jetski_planche.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.numero_immatriculation, {
                    x: bateauPositions.numeroImmatriculation.x,
                    y: bateauPositions.numeroImmatriculation.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.degats_apparents, {
                    x: bateauPositions.degatsApparents.x,
                    y: bateauPositions.degatsApparents.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.observations, {
                    x: bateauPositions.observations.x,
                    y: bateauPositions.observations.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.type, {
                    x: bateauPositions.type.x,
                    y: bateauPositions.type.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.annee, {
                    x: bateauPositions.annee.x,
                    y: bateauPositions.annee.y,
                    ...textStyle
                });



                // Load and draw initial impact image
                const initialImpactImagePath = path.join(__dirname, '../', bateau.point_de_choc_initial.url); // Update with dynamic path
                if (fs.existsSync(initialImpactImagePath)) {
                    const initialImpactImageBytes = fs.readFileSync(initialImpactImagePath);
                    const initialImpactImage = await pdfDoc.embedPng(initialImpactImageBytes); // Or embedJpg if your image is a JPEG
                    const { x, y } = bateauPositions.pointDeChocInitial;
                    firstPage.drawImage(initialImpactImage, {
                        x: x + 20, // Position adjustment for image
                        y: y - 60, // Position adjustment for image
                        width: 102,
                        height: 80,
                    });
                } else {
                    console.error(`Image not found at: ${initialImpactImagePath}`);
                }

                // Draw photos
                // const photoPositions = bateauPositions.photos;
                // let photoIndex = 0;

                // Function to draw a photo
                // const drawPhoto = async (photoUrl, x, y, width, height) => {
                //     const photoPath = path.join(__dirname, '../', photoUrl); // Update with dynamic path
                //     if (fs.existsSync(photoPath)) {
                //         const photoBytes = fs.readFileSync(photoPath);
                //         const photo = await pdfDoc.embedPng(photoBytes); // Or embedJpg if your image is a JPEG
                //         firstPage.drawImage(photo, { x, y, width, height });
                //     } else {
                //         console.error(`Image not found at: ${photoPath}`);
                //     }
                // };

                // Draw the registration certificate (front)
                // if (bateau.photos.certificat_immatriculation_recto.url) {
                //     await drawPhoto(bateau.photos.certificat_immatriculation_recto.url, photoPositions.x, photoPositions.y, 102, 80);
                //     photoIndex++;
                // }

                // Draw the registration certificate (back)
                // if (bateau.photos.certificat_immatriculation_verso.url) {
                //     await drawPhoto(bateau.photos.certificat_immatriculation_verso.url, photoPositions.x, photoPositions.y - 85, 102, 80);
                //     photoIndex++;
                // }

                // // Draw the driver's license (front)
                // if (bateau.photos.permis_recto.url) {
                //     await drawPhoto(bateau.photos.permis_recto.url, photoPositions.x, photoPositions.y - 170, 102, 80);
                //     photoIndex++;
                // }

                // // Draw the driver's license (back)
                // if (bateau.photos.permis_verso.url) {
                //     await drawPhoto(bateau.photos.permis_verso.url, photoPositions.x, photoPositions.y - 255, 102, 80);
                //     photoIndex++;
                // }

                // // Draw the insurance certificate
                // if (bateau.photos.certificat_assurance.url) {
                //     await drawPhoto(bateau.photos.certificat_assurance.url, photoPositions.x, photoPositions.y - 340, 102, 80);
                //     photoIndex++;
                // }

                // // Draw additional vehicle photos
                // if (bateau.photos.vehicule) {
                //     for (let i = 0; i < bateau.photos.vehicule.length; i++) {
                //         await drawPhoto(bateau.photos.vehicule[i].url, photoPositions.x, photoPositions.y - 425 - (i * 85), 102, 80);
                //         photoIndex++;
                //     }
                // }

                // Draw circumstances
                let circonstancesYPosition = bateauPositions.circonstances.y;
                bateau.circonstances.forEach((circumstance, index) => {
                    firstPage.drawText(`${index + 1}: ${circumstance}`, {
                        x: bateauPositions.circonstances.x,
                        y: circonstancesYPosition,
                        ...textStyle
                    });
                    circonstancesYPosition -= 10; // Adjust for next line
                });

                firstPage.drawText(bateau.circonstances.length.toString(), {
                    x: bateauPositions.nbr_de_choix.x,
                    y: bateauPositions.nbr_de_choix.y,
                    ...textStyle
                });

                // Draw insurance details
                firstPage.drawText(bateau.assurance.nom, {
                    x: bateauPositions.assurance.nom.x,
                    y: bateauPositions.assurance.nom.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.assurance.numero_assurance, {
                    x: bateauPositions.assurance.numeroAssurance.x,
                    y: bateauPositions.assurance.numeroAssurance.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.assurance.localisation, {
                    x: bateauPositions.assurance.localisation.x,
                    y: bateauPositions.assurance.localisation.y,
                    ...textStyle
                });

                
                firstPage.drawText(bateau.assurance.dommages, {
                    x: bateauPositions.assurance.dommages.x,
                    y: bateauPositions.assurance.dommages.y,
                    ...textStyle
                });

                // Draw pilote details
                firstPage.drawText(bateau.pilote.nom, {
                    x: bateauPositions.pilote.nom.x,
                    y: bateauPositions.pilote.nom.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.pilote.prenom, {
                    x: bateauPositions.pilote.prenom.x,
                    y: bateauPositions.pilote.prenom.y,
                    ...textStyle
                });

                const piloteLines = splitTextIntoLines(bateau.assure.adresse, 35);
                //const lineHeightss = 14; // Adjust as needed for spacing

               piloteLines.forEach((line, index) => {
                    firstPage.drawText(line, {
                        x: bateauPositions.pilote.adresse.x,
                        y: bateauPositions.pilote.adresse.y - (index * 14),
                        ...textStyle
                    });
                });
                // firstPage.drawText(bateau.pilote.adresse, {
                //     x: bateauPositions.pilote.adresse.x,
                //     y: bateauPositions.pilote.adresse.y,
                //     ...textStyle
                // });
                firstPage.drawText(bateau.pilote.categorie, {
                    x: bateauPositions.pilote.categorie.x,
                    y: bateauPositions.pilote.categorie.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.pilote.par, {
                    x: bateauPositions.pilote.par.x,
                    y: bateauPositions.pilote.par.y,
                    ...textStyle
                });

                firstPage.drawText(bateau.pilote.numero_permis, {
                    x: bateauPositions.pilote.numero_permis.x,
                    y: bateauPositions.pilote.numero_permis.y,
                    ...textStyle
                });


                
                firstPage.drawText(bateau.pilote.date_delivration, {
                    x: bateauPositions.pilote.date_delivration.x,
                    y: bateauPositions.pilote.date_delivration.y,
                    ...textStyle
                });

                // Draw assure details
                firstPage.drawText(bateau.assure.nom, {
                    x: bateauPositions.assure.nom.x,
                    y: bateauPositions.assure.nom.y,
                    ...textStyle
                });
                firstPage.drawText(bateau.assure.prenom, {
                    x: bateauPositions.assure.prenom.x,
                    y: bateauPositions.assure.prenom.y,
                    ...textStyle
                });

                const adresseLines = splitTextIntoLines(bateau.assure.adresse, 35);
                const lineHeights = 14; // Adjust as needed for spacing

                adresseLines.forEach((line, index) => {
                    firstPage.drawText(line, {
                        x: bateauPositions.assure.adresse.x,
                        y: bateauPositions.assure.adresse.y - (index * lineHeights),
                        ...textStyle
                    });
                });

                // firstPage.drawText(bateau.assure.adresse, {
                //     x: bateauPositions.assure.adresse.x,
                //     y: bateauPositions.assure.adresse.y,
                //     ...textStyle
                // });

            }
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
        console.log('PDF generated successfully');
    } catch (error) {
        console.error('Error generating PDF:', error);
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
// Example usage
module.exports = { fillPDFBoat };
