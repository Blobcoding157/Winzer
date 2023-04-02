/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import icon from './icon';

export default function LocationMarker() {
  const [position, setPosition] = useState(null);
  const [bbox, setBbox] = useState([]);

  const map = useMap();

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
      setBbox(e.bounds.toBBoxString().split(','));
      setPosition(e.latlng);
      map.flyTo(e.latlng);
    });
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={icon}>
      <Popup>
        You are here. <br />
        Map bbox: <br />
        <b>Southwest lng</b>: {bbox[0]} <br />
        <b>Southwest lat</b>: {bbox[1]} <br />
        <b>Northeast lng</b>: {bbox[2]} <br />
        <b>Northeast lat</b>: {bbox[3]}
      </Popup>
    </Marker>
  );
}
