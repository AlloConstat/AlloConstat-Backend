const Constat = require('../models/constatModel');
const ConstatBateau = require('../models/bateauModels'); 
const ResponseModels = require('../models/responseModels');

// Create Constat
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
      const carConstats = await Constat.find(); // Exemple de filtre par type
      res.status(200).json(carConstats);
    } catch (error) {
      res.status(500).json({ error: 'Erreur lors de la récupération des constats de voitures' });
    }
  };


  // Get Constat by ID
exports.getCarConstatById = async (req, res) => {
    try {
      const constat = await Constat.findById(req.params.id);
      if (!constat) {
        return res.status(404).json({ error: 'Constat not found' });
      }
      res.status(200).json(constat);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Constat' });
    }
  };
  
  // Get Boat by ID
  exports.getBoatConstatById = async (req, res) => {
    try {
      const boat = await ConstatBateau.findById(req.params.id);
      if (!boat) {
        return res.status(404).json({ error: 'Boat not found' });
      }
      res.status(200).json(boat);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching Boat' });
    }
  };
  
  // Update Constat by ID
  exports.updateCarConstatById = async (req, res) => {
    try {
      const updatedConstat = await Constat.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedConstat) {
        return res.status(404).json({ error: 'Constat not found' });
      }
      res.status(200).json(updatedConstat);
    } catch (error) {
      res.status(500).json({ error: 'Error updating Constat' });
    }
  };


  exports.updateBoatConstatById = async (req, res) => {
    try {
      const updatedConstat = await ConstatBateau.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedConstat) {
        return res.status(404).json({ error: 'Constat not found' });
      }
      res.status(200).json(updatedConstat);
    } catch (error) {
      res.status(500).json({ error: 'Error updating Constat' });
    }
  };


  const fs = require('fs');
  const path = require('path');
  
  exports.deleteConstatById = async (req, res) => {
      try {
          const { vehicleType } = req.body;
  
          // Choisir le modèle en fonction du type de véhicule
          const Model = vehicleType === 'car' ? Constat : ConstatBateau;
  
          // Chercher et supprimer le constat
          const constat = await Model.findByIdAndDelete(req.params.id);
          console.log('id',req.params.id,'vehicleType',vehicleType)
          if (!constat) return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
  
          if (vehicleType === 'car') {
              // Construire les chemins des fichiers à supprimer
              const filePath1 = path.join( __dirname,`../output/voitures/constat_${req.params._id}.pdf`);
              const filePath2 = path.join(__dirname,`../output/voitures/constat_${req.params._id}_duplicata.pdf`);
  
              // Supprimer les fichiers
              fs.unlink(filePath1, (err) => {
                  if (err && err.code !== 'ENOENT') {
                      console.error('Erreur lors de la suppression du fichier:', filePath1, err);
                  }
              });
  
              fs.unlink(filePath2, (err) => {
                  if (err && err.code !== 'ENOENT') {
                      console.error('Erreur lors de la suppression du fichier:', filePath2, err);
                  }
              });
          } else if  (vehicleType === 'board') {
            // Construire les chemins des fichiers à supprimer
            const filePath1 = path.join(__dirname, `../output/bateaux/constat_bateau_${req.params.id}.pdf`);
            const filePath2 = path.join(__dirname, `../output/bateaux/constat_bateau_${req.params.id}_duplicata.pdf`);

            // Supprimer les fichiers
            fs.unlink(filePath1, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Erreur lors de la suppression du fichier:', filePath1, err);
                }
            });

            fs.unlink(filePath2, (err) => {
                if (err && err.code !== 'ENOENT') {
                    console.error('Erreur lors de la suppression du fichier:', filePath2, err);
                }
            });
        } 
  
          res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS });
      } catch (err) {
          res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
      }
  };


exports.getConstatByRegion = async (req, res) => {
  try {
      const { region } = req.params;
      const { vehicleType } = req.body;

      let results;

      if (vehicleType === 'car') {
          results = await Constat.find({ region });
      } else if (vehicleType === 'boat') {
          results = await ConstatBateau.find({ region });
      } else {
          return res.status(400).send({ message: "Invalid vehicle type. Must be 'car' or 'boat'." });
      }

      if (results.length === 0) {
          return res.status(ResponseModels.NOT_FOUND.status).send(ResponseModels.NOT_FOUND);
      }

      res.status(ResponseModels.SUCCESS.status).send({ ...ResponseModels.SUCCESS, data: results });
  } catch (err) {
      res.status(ResponseModels.INTERNAL_SERVER_ERROR.status).send(ResponseModels.INTERNAL_SERVER_ERROR);
  }
};






