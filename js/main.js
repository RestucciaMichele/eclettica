// ...existing code...

// Registra Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registrato');
      })
      .catch(err => {
        console.log('ServiceWorker non registrato: ', err);
      });
  });
}
