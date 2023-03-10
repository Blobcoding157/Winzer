'use client';

import '../styles/map.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'react-leaflet-geosearch';
import icon from './icon';
import LocationMarker from './LocationMarker';
import SearchControl from './SearchControl';

const exampleTable = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    event_name: 'JohnParty',
    date_start: '2023-03-01',
    date_end: '2023-03-20',
    event_description:
      'this is a test event wow long text for testing testing testing test this is a test event wow long text for testing testing testing test',
    position: [48.1931, 16.31222],
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    event_name: 'JaneParty',
    date_start: '2023-03-01',
    date_end: '2023-03-20',
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
  const [mapData, setMapData] = useState([]);

  const prov = OpenStreetMapProvider();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/events', { method: 'GET' });
      const jsonData = await response.json();
      setMapData(jsonData);
    };
    fetchData().catch((err) => console.log(err));
  }, []);

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

        {/* <input className="search-bar" placeholder="Search..." /> */}
      </div>
      <div className="container">
        <MapContainer
          center={center}
          zoom={26}
          scrollWheelZoom={false}
          className="map"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <SearchControl
            provider={prov}
            showMarker={true}
            showPopup={false}
            popupFormat={({ query, result }) => result.label}
            maxMarkers={3}
            retainZoomLevel={false}
            animateZoom={true}
            autoClose={false}
            searchLabel={'Enter address, please'}
            keepResult={true}
          />

          {mapData.map((user) => {
            return (
              <Marker
                icon={icon}
                draggable={draggable}
                eventHandlers={eventHandlers}
                ref={markerRef}
                key={`event-${user.id}`}
                position={[user.coordinates[0], user.coordinates[1]]}
              >
                <Popup>
                  {user.img_url}
                  <img className="popup" alt="" src="/wine-drive.gif" />
                  {user.title +
                    ' ' +
                    user.date +
                    ' ' +
                    user.time_start +
                    ' - ' +
                    user.time_end}
                  <hr />
                  {user.description}
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
