$(document).ready(function() {
  const maps = document.querySelectorAll('.map');
  if (!maps) return;
  maps.forEach((map) => {
    const coords = JSON.parse(map.dataset.coords);
    // const bounds = new L.LatLngBounds(coords);
    // map.fitBounds(bounds);
    const thisMap = L.map(map).setView([coords[0], coords[1]], 15);
    L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://carto.com/attribution">CARTO</a>'
    }).addTo(thisMap);
    for (let i = 0; i < coords.length / 2; i++) {
      const marker = L.marker([coords[i], coords[i + 1]]).addTo(thisMap);
    }
    thisMap.scrollWheelZoom.disable();
  });
});
