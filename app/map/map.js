'use client';

import '../styles/map.scss';
import '../styles/globals.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-geosearch/dist/geosearch.umd.js';
import Router from 'next/router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'react-leaflet-geosearch';
import icon from './icon';
import LocationMarker from './LocationMarker';
import SearchControl from './SearchControl';

const center = [48.1931, 16.31222];

export default function Map(props) {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const [errors, setErrors] = useState([]);
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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const response = await fetch('(api/participation)', {
  //       method: 'GET',
  //       body: JSON.stringify({ query, id }),
  //     });
  //     const jsonData = await response.json();

  //     jsonData.map(() => {});
  //   };
  //   fetchData().catch((err) => console.log(err));
  // }, []);

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
          <SearchControl
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
          />

          {mapData.map((eventMarker) => {
            async function handleAttendingImages(event) {
              event.preventDefault();

              const id = eventMarker.id;
              const query = 'getAttendingUserProfilePictures';

              const attendingImages = await fetch('/api/participation', {
                method: 'GET',
                body: JSON.stringify({ query, id }),
              });

              const attendingImagesData = await attendingImages.json();
              console.log(attendingImagesData);
              attendingImagesData.map((image) => {
                return (
                  <img
                    alt="Attendees"
                    key={`key-${image.id}`}
                    className="profile-picture"
                    src={image.profilePicture}
                  />
                );
              });
            }

            return (
              <Marker
                icon={icon}
                draggable={draggable}
                eventHandlers={eventHandlers}
                ref={markerRef}
                key={`event-${eventMarker.id}`}
                position={[eventMarker.latitude, eventMarker.longitude]}
              >
                <Popup>
                  <div className="popup-container">
                    <img
                      className="popup-image"
                      alt="event-banner"
                      src={eventMarker.imgUrl}
                    />
                    <h1 className="popup-title">{eventMarker.title}</h1>
                    <div className="popup-date-time-container">
                      <div className="popup-date">{eventMarker.eventDate}</div>
                      <div className="popup-time">
                        {eventMarker.eventStart} - {eventMarker.eventEnd}
                      </div>
                    </div>
                    <div className="popup-description-container">
                      <div className="popup-description">
                        {eventMarker.description}
                      </div>
                    </div>
                    <div className="popup-button-container">
                      <div className="popup-attending-pictures">
                        {handleAttendingImages}
                      </div>
                      <button
                        onClick={async function handleJoinEvent(event) {
                          event.preventDefault();

                          const userId = props.user.id;
                          const eventId = eventMarker.id;

                          const response = await fetch('/api/participation', {
                            method: 'POST',
                            body: JSON.stringify({
                              userId,
                              eventId,
                            }),
                          });
                          const responseData = await response.json();
                          if ('error' in responseData) {
                            setErrors(responseData.error);
                            return;
                          }
                        }}
                        className="popup-join-button"
                      >
                        Join
                      </button>
                    </div>
                  </div>
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
