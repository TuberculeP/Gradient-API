const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Route principale de l'API
app.get('/api/gradient', (req, res) => {
  // Récupération des paramètres de l'URL, avec fallback par défaut
  const colors = req.query.colors || 'ff0000,0000ff';
  const colorArr = colors.split(',');

  // Génération des étapes du gradient
  const stops = colorArr.map((c, i) => {
    const offset = Math.round((i / (colorArr.length - 1)) * 100);
    return `<stop offset="${offset}%" stop-color="#${c}" />`;
  }).join('');

  // Création du SVG (ici en diagonale x1/y1 -> x2/y2)
  const svg = `
  <svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${stops}
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
  </svg>`;

  // Envoi de la réponse en tant que vraie image SVG
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // Met en cache pour 24h
  res.status(200).send(svg);
});

// Route de santé (pratique pour que Coolify vérifie que le conteneur tourne)
app.get('/', (req, res) => {
  res.send('API active. Utilisez le point de terminaison : /api/gradient?colors=FF5733,33FF57');
});

// Lancement du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});