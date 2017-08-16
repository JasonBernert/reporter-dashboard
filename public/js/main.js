$(document).ready(function() {
  const maps = document.querySelectorAll('.map');
  if (!maps) return;
  maps.forEach((map) => {
    const coords = JSON.parse(map.dataset.coords);
    if (coords.length === 0) return;
    const thisMap = L.map(map).setView([coords[0], coords[1]], 15);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attribution">CARTO</a>'
    }).addTo(thisMap);
    const bounds = [];
    for (let i = 0; i < coords.length; i += 2) {
      const marker = L.marker([coords[i], coords[i + 1]]).addTo(thisMap);
      bounds.push([coords[i], coords[i + 1]]);
    }
    thisMap.fitBounds(bounds).zoomOut();
    thisMap.scrollWheelZoom.disable();
  });
});
