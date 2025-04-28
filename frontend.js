videoPlayer.src({
  src: '/hls/test.m3u8', // Utilisez l'URL proxifiée
  type: 'application/x-mpegURL'
});

videoPlayer.on('error', function () {
  const error = videoPlayer.error();
  if (error && error.message) {
    console.error('Une erreur est survenue lors de la lecture du flux HLS.');
  }
});