$(document).ready(function() {
  const maps = document.querySelector('#map');
  if (!maps) return;
  const map = L.map('map').setView([maps.dataset.lat, maps.dataset.lon], 15);
  L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attribution">CARTO</a>'
  }).addTo(map);
  const marker = L.marker([maps.dataset.lat, maps.dataset.lon]).addTo(map);
  map.scrollWheelZoom.disable();
});
