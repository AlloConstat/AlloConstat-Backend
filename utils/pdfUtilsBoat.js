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
                    points_endommages : { x: 97, y: 166},
                    numeroImmatriculation: { x: 125, y: 510 },
                    degatsApparents: { x: 40, y: 60 },
                    jetski_planche: { x: 415, y: 284 },
                    type: { x: 64, y: 523 },
                    annee: { x: 150, y: 523 },
                    bateauType: {
                        1: { x: 115, y: 551 },
                        2: { x: 177, y: 551 },
                        3: { x: 78, y: 486 },
                        4: { x: 195, y: 486 }
                    },
                   // pointDeChocInitial: { x: 28, y: 216 },
                   // photos: { x: 450, y: 360 },
                    assurance: {
                        nom: { x: 40, y: 440 },
                        numeroAssurance: { x: 90, y: 427 },
                        localisation: { x: 115, y: 414 },
                        dommages: { 
                            yes: { x: 117, y: 390 }, // Position for "Oui"
                            no: { x: 168, y: 390 }   // Position for "Non"
                        } 
                    },
                    pilote: {
                        nom: { x: 90, y: 342 },
                        prenom: { x: 85, y: 329 },
                        adresse: { x: 40, y: 305 },
                        categorie: { x: 190, y: 277 },
                        par: { x: 95, y: 265 },
                        date_delivration: { x: 150, y: 265 },
                    },
                    assure: {
                        nom: { x: 90, y: 634 },
                        prenom: { x: 78, y: 621 },
                        adresse: { x: 40, y: 595 },
                    },
                    circonstances: { x: 218, y: 620 },
                    nbr_de_choix: {x: 216, y: 266 }
                },
                B: {
                    marque: { x: 425, y: 536 },
                    numeroImmatriculation: { x: 480, y: 510 },
                    degatsApparents: { x: 390, y: 60 },
                    points_endommages : { x: 447, y: 166},
                    type: { x: 413, y: 523 },
                    bateauType: {
                        1: { x: 465, y: 551 },
                        2: { x: 527, y: 551 },
                        3: { x: 429, y: 486 },
                        4: { x: 548, y: 486 }
                    },
                    annee: { x: 528, y: 523 },
                    jetski_planche: { x: 415, y: 284 },
                    assurance: {
                        nom: { x: 390, y: 440 },
                        numeroAssurance: { x: 445, y: 427 },
                        localisation: { x: 465, y: 414 },
                        dommages: { 
                            yes: { x: 470, y: 390 }, // Position for "Oui"
                            no: { x: 521, y: 390 }   // Position for "Non"
                        }
                    },
                    pilote: {
                        nom: { x: 440, y: 347 },
                        prenom: { x: 430, y: 333 },
                        adresse: { x: 390, y: 308 },
                        categorie: { x: 540, y: 282 },
                        par: { x: 445, y: 268 },
                        date_delivration: { x: 525, y: 268 },
                    },
                    assure: {
                        nom: { x: 442, y: 634 },
                        prenom: { x: 430, y: 621 },
                        adresse: { x: 390, y: 595 },
                        
                    },
                    circonstances: { x: 372, y: 620 },
                    nbr_de_choix: {x: 365, y: 266 }
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


                        // Draw bateauType for bateaux A
                        if (bateau.bateauType[0] == 1) {
                            firstPage.drawText('x', {
                                x: bateauPositions.bateauType[1].x,
                                y: bateauPositions.bateauType[1].y,
                                ...textStyle
                            });
                        }

                        if (bateau.bateauType[1] == 2) {
                            firstPage.drawText('x', {
                                x: bateauPositions.bateauType[2].x,
                                y: bateauPositions.bateauType[2].y,
                                ...textStyle
                            });
                        }

                        if (bateau.bateauType[2] == 3) {
                            console.log('d5aler')
                            firstPage.drawText('x', {
                                x: bateauPositions.bateauType[3].x,
                                y: bateauPositions.bateauType[3].y,
                                ...textStyle
                            });
                        }

                        if (bateau.bateauType[3] == 4) {
                            firstPage.drawText('x', {
                                x: bateauPositions.bateauType[4].x,
                                y: bateauPositions.bateauType[4].y,
                                ...textStyle
                            });
                        }


                firstPage.drawText(bateau.numero_immatriculation, {
                    x: bateauPositions.numeroImmatriculation.x,
                    y: bateauPositions.numeroImmatriculation.y,
                    ...textStyle
                });

                const degatLines = splitTextIntoLines(bateau.degats_apparents, 35);
                

                degatLines.forEach((line, index) => {
                     firstPage.drawText(line, {
                         x: bateauPositions.degatsApparents.x,
                         y: bateauPositions.degatsApparents.y - (index * 10),
                         ...textStyle
                     });
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


                const maxPoints = 7;
                const pointsX = bateauPositions.points_endommages.x;
                const basePointsY = bateauPositions.points_endommages.y;
                const variables = bateauPositions.points_endommages.y + 26;
                const pointsLineHeight = 13;
                const newPointsLineHeight = 20.3;
                const alternateX = pointsX + 98.5;// Exemple d'un second x pour les deux premiers points
        
                for (let i = 0; i < Math.min(maxPoints, bateau.points_endommages.length); i++) {
                    const point = bateau.points_endommages[i];
                    
                    let xPosition;
                    let yPosition;
                
                    // Déterminer les positions x et y
                    if (i < 2) {
                        xPosition = pointsX;
                        yPosition = basePointsY - (i * pointsLineHeight);
                    } else {
                        xPosition = alternateX;  // Espacer les cinq autres par des valeurs x
                        yPosition = variables - (i * pointsLineHeight) ;
                    }
                
                    const text = point ? 'x' : '';
                
                    firstPage.drawText(text, {
                        x: xPosition,
                        y: yPosition,
                        ...textStyle
                    });
                }
                
                
                // Draw circumstances
                const totalCircumstances = 17;
                const circumstancesX = bateauPositions.circonstances.x;
                const baseCircumstancesY = bateauPositions.circonstances.y;
                const lineHeight = 20;
                const newLineHeight = 20.3;
                
                for (let i = 1; i <= totalCircumstances; i++) {
                    const currentLineHeight = i >= 9 ? newLineHeight : lineHeight;
                    const yPosition = baseCircumstancesY - ((i - 1) * currentLineHeight);
                    const isCircumstancePresent = bateau.circonstances.includes(i.toString());
                    const text = isCircumstancePresent ? 'x' : '';
                
                    firstPage.drawText(text, {
                        x: circumstancesX,
                        y: yPosition,
                        ...textStyle
                    });
                }

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



                
                const typePosition = bateau.assurance.dommages ? bateauPositions.assurance.dommages.yes : bateauPositions.assurance.dommages.no;
                firstPage.drawText('x', {
                    x: typePosition.x,
                    y: typePosition.y,
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
                

               piloteLines.forEach((line, index) => {
                    firstPage.drawText(line, {
                        x: bateauPositions.pilote.adresse.x,
                        y: bateauPositions.pilote.adresse.y - (index * 14),
                        ...textStyle
                    });
                });
                
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

                // firstPage.drawText(bateau.pilote.numero_permis, {
                //     x: bateauPositions.pilote.numero_permis.x,
                //     y: bateauPositions.pilote.numero_permis.y,
                //     ...textStyle
                // });


                
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
