'use client';
import './map.scss';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const LeafletMap = () => {
  const mapRef = useRef<L.Map>();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([51.505, -0.09], 13);
    }
  }, []);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={23}
      scrollWheelZoom={true}
      className="map"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>this is a popup</Popup>
      </Marker>
    </MapContainer>
  );
};

export default LeafletMap;
