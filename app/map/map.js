'use client';

import '../styles/map.scss';
import '../styles/globals.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-geosearch/dist/geosearch.umd.js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'react-leaflet-geosearch';
import icon from './icon';
import LocationMarker from './LocationMarker';
import SearchControl from './SearchControl';

const center = [48.1931, 16.31222];

export default function Map({ user, participations, events }) {
  const [draggable, setDraggable] = useState(false);
  const [position, setPosition] = useState(center);
  const [errors, setErrors] = useState([]);
  const markerRef = useRef(null);
  const [mapData, setMapData] = useState(events);
  const [mapParticipations, setMapParticipations] = useState(participations);
  const router = useRouter();

  const prov = OpenStreetMapProvider();

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

  return (
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
          return (
            <Marker
              icon={icon}
              draggable={draggable}
              eventHandlers={eventHandlers}
              ref={markerRef}
              key={`event-${eventMarker.id}`}
              position={[eventMarker.latitude, eventMarker.longitude]}
            >
              <Popup className="popup-container">
                <div className="popup-content-container">
                  <img
                    className="popup-header"
                    alt="event-banner"
                    src={eventMarker.imgUrl}
                  />
                  <div className="popup-creator-container">
                    <img
                      className="popup-creator-picture"
                      alt="event-creator"
                      src={eventMarker.profilePicture}
                    />
                    <div className="popup-creator-name">
                      <Link href={`/profile/${eventMarker.username}`}>
                        @{eventMarker.username}
                      </Link>
                    </div>

                    <div>
                      {user.id === eventMarker.userId && user.roleId >= 2 ? (
                        <button className="event-delete-button">delete</button>
                      ) : (
                        <div />
                      )}
                    </div>
                  </div>
                  <div className="popup-info-container">
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
                  </div>
                  <div className="popup-attending-container">
                    <div className="popup-button-container">
                      <div className="popup-attending-pictures">
                        {mapParticipations.map((participation) => {
                          if (participation.eventId === eventMarker.id) {
                            return (
                              <div
                                className="popup-attending-picture"
                                key={`user-${participation.id}`}
                              >
                                <img
                                  className="popup-attending-picture"
                                  alt="attending user"
                                  src={participation.profilePicture}
                                />
                              </div>
                            );
                          }
                        })}
                      </div>
                      <button
                        onClick={async function handleJoinEvent(event) {
                          event.preventDefault();

                          const userId = user.id;
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
                          router.refresh();
                        }}
                        className="popup-join-button"
                      >
                        Join
                      </button>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
        <LocationMarker />
      </MapContainer>
    </div>
  );
}
