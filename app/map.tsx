'use client';
import './map.scss';
import L from 'leaflet';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, TileLayer } from 'react-leaflet';

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
      zoom={13}
      style={{ height: '400px' }}
      whenCreated={(map) => (mapRef.current = map)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[51.505, -0.09]} />
    </MapContainer>
  );
};

export default LeafletMap;
