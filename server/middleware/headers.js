const setSecurityHeaders = (req, res, next) => {
  // Configurer Cache-Control
  res.setHeader('Cache-Control', 'public, max-age=3600'); // 1 heure de cache

  // Ajouter des en-têtes de sécurité modernes
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Security-Policy', "frame-ancestors 'self'");

  // Supprimer les en-têtes obsolètes
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('Pragma');
  res.removeHeader('Expires');

  next();
};

module.exports = setSecurityHeaders;
