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

        // Load custom font (Arial)
        const customFontPath = path.join(__dirname, 'Arial.ttf');
        const customFontBytes = fs.readFileSync(customFontPath);
        const customFont = await pdfDoc.embedFont(customFontBytes);

        // Load the initial impact image
        const initialImpactImagePath = path.join(__dirname, '../test.png'); // Change to your image path
        const initialImpactImageBytes = fs.readFileSync(initialImpactImagePath);
        const initialImpactImage = await pdfDoc.embedPng(initialImpactImageBytes); // Or embedJpg if your image is a JPEG

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        const positions = {
            dateAccident: { x: 50, y: 720 },
            heure_accident: { x: 135, y: 720 },
            lieu: { x: 180, y: 720 },
            blesses: { 
                yes: { x: 535, y: 721 }, // Position for "Oui"
                no: { x: 458, y: 721 }   // Position for "Non"
            }, // x: 80, y: 680
            degats_materiels: { 
                yes: { x: 136, y: 687 }, // Position for "Oui"
                no: { x: 65, y: 687 }   // Position for "Non"
            },
            temoins: { x: 180, y: 685 },
            vehicles: {
                A: {
                    nom: { x: 50, y: 600 },
                    marque: { x: 100, y: 350 },
                    numeroImmatriculation: { x: 120, y: 332 },
                    degatsApparents: { x: 40, y: 130 },
                    observations: { x: 40, y: 100 },
                    sensSuiviVenants: { x: 80, y: 300 },
                    sensSuiviAllants: { x: 80, y: 285 },
                    pointDeChocInitial: { x: 500, y: 500 },
                    photos: { x: 450, y: 360 },
                    assurance: {
                        nom: { x: 110, y: 632 },
                        numeroAssurance: { x: 118, y: 615 },
                        localisation: { x: 80, y: 598 },
                        dateValiditeDebut: { x: 140, y: 565 },
                        dateValiditeFin: { x: 50, y: 565 },
                    },
                    conducteur: {
                        nom: { x: 80, y: 537 },
                        prenom: { x: 80, y: 520 },
                        adresse: { x: 80, y: 503 },
                        numeroPermis: { x: 130, y: 487 },
                        dateDelivration: { x: 80, y: 470 },
                    },
                    assure: {
                        nom: { x: 70, y: 433 },
                        prenom: { x: 70, y: 418 },
                        adresse: { x: 70, y: 400 },
                        tel: { x: 160, y: 383 },
                    },
                    circonstances: { x: 950, y: 60 }
                },
                B: {
                    nom: { x: 50, y: 450 },
                    marque: { x: 100, y: 420 },
                    numeroImmatriculation: { x: 150, y: 390 },
                    degatsApparents: { x: 200, y: 360 },
                    observations: { x: 250, y: 330 },
                    sensSuiviVenants: { x: 300, y: 300 },
                    sensSuiviAllants: { x: 350, y: 270 },
                    pointDeChocInitial: { x: 400, y: 240 },
                    photos: { x: 450, y: 210 },
                    assurance: {
                        nom: { x: 500, y: 180 },
                        numeroAssurance: { x: 550, y: 150 },
                        localisation: { x: 600, y: 120 },
                        dateValiditeDebut: { x: 650, y: 90 },
                        dateValiditeFin: { x: 650, y: 70 },
                    },
                    conducteur: {
                        nom: { x: 700, y: 60 },
                        prenom: { x: 750, y: 30 },
                        adresse: { x: 800, y: 0 },
                        numeroPermis: { x: 850, y: -30 },
                        dateDelivration: { x: 900, y: -60 },
                    },
                    circonstances: { x: 950, y: -90 }
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

        
        // Determine position for degat_materiel based on value
        const degats_materiels = formData.degats_materiels ? positions.degats_materiels.yes : positions.degats_materiels.no;
        firstPage.drawText('x', {
            x: degats_materiels.x,
            y: degats_materiels.y,
            ...textStyle
        });

        // firstPage.drawText(formData.degats_materiels ? 'Oui' : 'Non', {
        //     x: positions.degatsMateriels.x,
        //     y: positions.degatsMateriels.y,
        //     ...textStyle
        // });

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
                firstPage.drawText(vehicle.point_de_choc_initial.description, {
                    x: vehiclePositions.pointDeChocInitial.x,
                    y: vehiclePositions.pointDeChocInitial.y,
                    ...textStyle
                });

                // Draw initial impact image
                if (vehicle.point_de_choc_initial.image) {
                    const { x, y, width, height } = vehicle.point_de_choc_initial.image; // Ensure image data includes dimensions
                    firstPage.drawImage(initialImpactImage, {
                        x: x || vehiclePositions.pointDeChocInitial.x,
                        y: y || vehiclePositions.pointDeChocInitial.y,
                        width: width || 100, // Default width if not provided
                        height: height || 100 // Default height if not provided
                    });
                }

                // Draw photos
                vehicle.photos.forEach((photo, index) => {
                    const photoYPosition = vehiclePositions.photos.y - (index * 15);
                    firstPage.drawText(photo.description, {
                        x: vehiclePositions.photos.x,
                        y: photoYPosition,
                        ...textStyle
                    });
                });

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
                    x: vehiclePositions.assurance.dateValiditeDebut.x,
                    y: vehiclePositions.assurance.dateValiditeDebut.y,
                    ...textStyle
                });
                firstPage.drawText(vehicle.assurance.date_validiteFin, {
                    x: vehiclePositions.assurance.dateValiditeFin.x,
                    y: vehiclePositions.assurance.dateValiditeFin.y,
                    ...textStyle
                });

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
                firstPage.drawText(vehicle.assure.tel, {
                    x: vehiclePositions.assure.tel.x,
                    y: vehiclePositions.assure.tel.y,
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

                vehicle.circonstances.forEach((circonstance, index) => {
                    const circonstanceYPosition = vehiclePositions.circonstances.y - (index * 15);
                    firstPage.drawText(circonstance, {
                        x: vehiclePositions.circonstances.x,
                        y: circonstanceYPosition,
                        ...textStyle
                    });
                });
            }
        });

        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync(outputPath, pdfBytes);
    } catch (error) {
        console.error(`Error filling PDF: ${error.message}`);
        throw error;
    }
}

module.exports = { fillPDF };
