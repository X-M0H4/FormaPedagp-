const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const sanitizeHtml = require('sanitize-html');

const app = express();

// Middleware pour traiter les données JSON envoyées
app.use(bodyParser.json());

// Servir les fichiers statiques du dossier Formation
app.use(express.static(path.join(__dirname)));

// Route pour recevoir les données du formulaire avec validation et assainissement
app.post('/submit', 
  [
    body('name').trim().notEmpty().withMessage('Le nom est requis'),
    body('email').isEmail().withMessage('Email invalide'),
    body('message').trim().notEmpty().withMessage('Le message est requis')
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Assainir les données pour éviter les attaques XSS
    const name = sanitizeHtml(req.body.name);
    const email = sanitizeHtml(req.body.email);
    const message = sanitizeHtml(req.body.message);
 // Log des données reçues après assainissement
 console.log('Formulaire reçu:');
 console.log('Nom:', name);
 console.log('Email:', email);
 console.log('Message:', message);

 // Répondre au client
 res.status(200).send('Données validées et reçues avec succès');
});

// Route pour tester la réponse du serveur
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'index.html'));
});

// Lancer le serveur sur le port 3001 ou un port dynamique pour les environnements déployés
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);

});