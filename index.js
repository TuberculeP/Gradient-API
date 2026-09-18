const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/api/gradient', (req, res) => {
  // Récupération des paramètres
  const colors = req.query.colors || 'ff0000,0000ff';
  const angle = parseFloat(req.query.angle) || 90; 
  
  // Nouveaux paramètres pour contrôler la taille de base de l'image
  const width = req.query.width || '800'; 
  const height = req.query.height || '800';

  const colorArr = colors.split(',');

  // Génération des étapes de couleurs
  const stops = colorArr.map((c, i) => {
    const offset = Math.round((i / (colorArr.length - 1)) * 100);
    return `<stop offset="${offset}%" stop-color="#${c}" />`;
  }).join('');

  // Conversion de l'angle en coordonnées SVG
  const rad = angle * (Math.PI / 180);
  const x1 = (50 + Math.sin(rad + Math.PI) * 50).toFixed(2);
  const y1 = (50 - Math.cos(rad + Math.PI) * 50).toFixed(2);
  const x2 = (50 + Math.sin(rad) * 50).toFixed(2);
  const y2 = (50 - Math.cos(rad) * 50).toFixed(2);

  // Création du SVG
  // L'attribut preserveAspectRatio="none" force l'image à stretcher !
  const svg = `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="${x1}%" y1="${y1}%" x2="${x2}%" y2="${y2}%">
        ${stops}
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(svg);
});

app.get('/', (req, res) => {
  res.send('API active. Exemple : /api/gradient?colors=FF5733,33FF57&angle=135&width=1200&height=400');
});

app.listen(port, () => {
  console.log(`Serveur démarré sur le port ${port}`);
});