'use client';
import '../styles/map.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import * as L from 'leaflet';
import { useCallback, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import LocationMarker from './LocationMarker';

const exampleTable = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    event_name: 'JohnParty',
    event_description:
      'this is a test event wow long text for testing testing testing test this is a test event wow long text for testing testing testing test',
    position: [48.1931, 16.31222],
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    event_name: 'JaneParty',
    event_description:
      'this is a test event wow long text for testing testing testing test this is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing test',
    position: [48.1931, 16.31722],
  },
];

const center = [48.1931, 16.31222];

export default function Map() {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const markerRef = useRef(null);

  // draggable isn't working. next idea is to update the actual position in the database on eventhandler

  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker !== null) {
          // instead of useState, update via api call
          setPosition(marker.getLatLng());
        }
      },
    }),
    [],
  );

  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  return (
    <>
      <div className="search-button-container">
        <button className="drag-button" onClick={toggleDraggable}>
          {draggable ? 'unlock' : 'lock'}
        </button>

        <input className="search-bar" placeholder="Search..." />
      </div>
      <div className="container">
        <MapContainer
          center={center}
          zoom={26}
          scrollWheelZoom={true}
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {exampleTable.map((user) => {
            return (
              <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                ref={markerRef}
                key={`user-${user.id}`}
                position={[user.position[0], user.position[1]]}
              >
                <Popup>
                  <img className="popup" alt="" src="/wine-drive.gif" />
                  {user.event_name}
                  <hr />
                  {user.event_description}
                  <br />
                  <button>Join</button>
                </Popup>
              </Marker>
            );
          })}
          <LocationMarker />
        </MapContainer>
      </div>
    </>
  );
}
