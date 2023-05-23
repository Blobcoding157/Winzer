/* eslint-disable @typescript-eslint/no-unnecessary-condition */
'use client';

import '../styles/globals.scss';
import '../styles/host.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-geosearch/dist/geosearch.umd.js';
import L from 'leaflet';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'react-leaflet-geosearch';
import icon from '../map/icon';
import SearchControl from '../map/SearchControl';

export default function HostForm({ user }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [marker, setMarker] = useState([]);
  const [coordinates, setCoordinates] = useState([]);
  const [errors, setErrors] = useState([]);
  const router = useRouter();

  const center = [48.1931, 16.31222];

  const prov = OpenStreetMapProvider();

  function SetPin() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        if (marker) {
          map.removeLayer(marker);
        }
        const newMarker = L.marker([lat, lng], { icon }).addTo(map);
        setMarker(newMarker);
        setCoordinates([lat, lng]);
      },
    });
    return null;
  }

  async function handleOnSubmitHeader(event) {
    event.preventDefault();

    const latitude = coordinates[0];
    const longitude = coordinates[1];

    const userId = user ? user.id : undefined;

    const form = event.currentTarget;
    const fileInput = Array.from(form.elements).find(
      ({ name }) => name === 'file',
    );

    const formData = new FormData();

    for (const file of fileInput.files) {
      formData.append('file', file);
    }

    formData.append('upload_preset', 'winzer-upload');

    const data = await fetch(
      'https://api.cloudinary.com/v1_1/winzer-images/image/upload',
      {
        method: 'POST',
        body: formData,
      },
    ).then((r) => r.json());

    const imgUrl = data.secure_url;

    const response = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        eventDate,
        eventStart,
        eventEnd,
        latitude,
        longitude,
        imgUrl,
        userId,
      }),
    });

    const responseData = await response.json();

    if ('errors' in responseData) {
      setErrors(responseData.errors);
      return;
    }

    router.replace(`/`);
    router.refresh();
  }

  return (
    <main className="host-container">
      <Image
        priority
        src="/wine-scenery.gif"
        alt="Artistic Background"
        className="background-image"
        fill
      />
      <div className="host-form-map-container">
        <div className="host-form-container">
          {user && (user.roleId === 2 || user.roleId === 3) ? (
            <form
              className="host-form"
              method="POST"
              onSubmit={handleOnSubmitHeader}
            >
              <div className="host-form-contents">
                <h2>LETS START A PARTY</h2>
                <input
                  className="host-form-title"
                  placeholder="Title"
                  value={title}
                  onChange={(event) => setTitle(event.currentTarget.value)}
                />
                <textarea
                  className="host-form-description"
                  placeholder="Description"
                  maxLength={300}
                  value={description}
                  onChange={(event) =>
                    setDescription(event.currentTarget.value)
                  }
                />
                <div
                  data-text="Choose a banner-picture"
                  className="host-form-image-container"
                >
                  <input
                    className="host-form-image"
                    placeholder="Image URL"
                    type="file"
                    name="file"
                  />
                </div>
                <div className="host-form-date-time-container">
                  <input
                    className="host-form-date"
                    placeholder="Event Date"
                    value={eventDate}
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(event) =>
                      setEventDate(event.currentTarget.value.toString())
                    }
                  />
                  <input
                    className="host-form-time"
                    placeholder="Time Start"
                    value={eventStart}
                    type="time"
                    onChange={(event) =>
                      setEventStart(event.currentTarget.value.toString())
                    }
                  />
                  <input
                    className="host-form-time-with-radius"
                    placeholder="Time End"
                    type="time"
                    value={eventEnd}
                    onChange={(event) => setEventEnd(event.currentTarget.value)}
                  />
                </div>

                <button className="host-form-confirm-button">
                  Lets do it!
                </button>
                <div>{errors.toString()}</div>
              </div>
            </form>
          ) : (
            <div className="wrong-login-container">
              {'You are not allowed to host a party. Please login with a host account.'
                .split(' ')
                .map((char, index) => {
                  return (
                    <div
                      key={`indexKey-${(index, char)}`}
                      className="wrong-login"
                    >
                      {char}
                    </div>
                  );
                }, [])}
            </div>
          )}
        </div>
        <div className="host-map-container">
          <MapContainer
            center={[center[0], center[1]]}
            zoom={26}
            scrollWheelZoom={true}
            className="host-map"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <SearchControl
              provider={prov}
              showMarker={true}
              showPopup={false}
              popupFormat={({ result }) => result.label}
              maxMarkers={3}
              retainZoomLevel={false}
              animateZoom={true}
              autoClose={false}
              searchLabel="Enter address"
              keepResult={true}
            />

            {/* <LocationMarker /> */}
            <SetPin />
          </MapContainer>
        </div>
      </div>
    </main>
  );
}
