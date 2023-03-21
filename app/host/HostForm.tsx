'use client';

import '../styles/globals.scss';
import '../styles/host.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-geosearch/dist/geosearch.css';
import 'leaflet-geosearch/dist/geosearch.umd.js';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import L from 'leaflet';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Router from 'next/router';
import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { OpenStreetMapProvider } from 'react-leaflet-geosearch';
import { EventResponseBodyPost } from '../api/events/route';
import icon from '../map/icon';
import LocationMarker from '../map/LocationMarker';
import SearchControl from '../map/SearchControl';

export default function HostForm(props: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [marker, setMarker] = useState<any>([]);
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const center: any = [48.1931, 16.31222];

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
    const userId = props.user.id;

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

    const responseData: EventResponseBodyPost = await response.json();

    if ('errors' in responseData) {
      setErrors(responseData.errors);
      return;
    }
  }

  return (
    <div className="host-container">
      <Image
        src="/wine-scenery.gif"
        alt="Artistic Background"
        className="background-image"
        fill
      />
      <div className="host-form-map-container">
        <div className="host-form-container">
          <form
            className="host-form"
            method="POST"
            onSubmit={handleOnSubmitHeader}
          >
            <div className="host-form-contents">
              <h1>LETS START A PARTY</h1>
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
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
              <div
                data-text={'Choose a banner-picture'}
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
              <Link href="/">
                <button className="host-form-confirm-button">
                  Lets do it!
                </button>
              </Link>
              <div>{errors.toString()}</div>
            </div>
          </form>
        </div>
        <div className="map-container">
          <MapContainer
            center={[center[0], center[1]]}
            zoom={26}
            scrollWheelZoom={true}
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

            {/* <LocationMarker /> */}
            <SetPin />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
