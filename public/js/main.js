$(document).ready(function() {
  const maps = document.querySelector('#map');
  if (!maps) return;
  const map = L.map('map').setView([maps.dataset.lat, maps.dataset.lon], 15);
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png').addTo(map);
  const marker = L.marker([maps.dataset.lat, maps.dataset.lon]).addTo(map);
});
