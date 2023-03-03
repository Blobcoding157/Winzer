import L from 'leaflet';

export default L.icon({
  iconSize: [35, 35],
  iconAnchor: [15, 40],
  popupAnchor: [3, -40],
  iconUrl: '/pin.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png',
});
