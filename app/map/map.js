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
        {/* <button className="drag-button" onClick={toggleDraggable}>
          {draggable ? 'unlock' : 'lock'}
        </button> */}

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
          {/* <SearchControl
            provider={prov}
            showMarker={true}
            showPopup={false}
            popupFormat={({ query, result }) => result.label}
            maxMarkers={3}
            retainZoomLevel={false}
            animateZoom={true}
            autoClose={false}
            searchLabel={'Enter address'}
            keepResult={true}
          /> */}

          {mapData.map((user) => {
            return (
              <Marker
                icon={icon}
                draggable={draggable}
                eventHandlers={eventHandlers}
                ref={markerRef}
                key={`event-${user.id}`}
                position={[user.latitude, user.longitude]}
              >
                <Popup>
                  {user.img_url}
                  <img className="popup" alt="" src="/wine-drive.gif" />
                  {user.title +
                    ' ' +
                    user.eventStart +
                    ' - ' +
                    user.eventEnd +
                    ' ' +
                    user.eventDate}
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
