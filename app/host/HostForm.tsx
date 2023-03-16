'use client';

import '../styles/host.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import L from 'leaflet';
import Image from 'next/image';
import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { EventResponseBodyPost } from '../api/events/route';
import icon from '../map/icon';

export default function HostForm(props: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventStart, setEventStart] = useState('');
  const [eventEnd, setEventEnd] = useState('');
  const [marker, setMarker] = useState<Marker<any>>([]);
  const [coordinates, setCoordinates] = useState<number[]>([]);
  const [imgUrl, setImgUrl] = useState('');
  const [errors, setErrors] = useState<{ message: string }[]>([]);

  const center = [48.1931, 16.31222];

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

  return (
    <div className="host-container">
      <Image
        src="/wine-scenery.gif"
        alt="Artistic Background Image"
        className="background-image"
        layout="fill"
        objectFit="cover"
        quality={100}
      />
      <div className="host-form-map-container">
        <div className="host-form-container">
          <form
            className="host-form"
            onSubmit={async (event) => {
              event.preventDefault();

              const latitude = coordinates[0];
              const longitude = coordinates[1];
              const userId = props.user.id;

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

              const data: EventResponseBodyPost = await response.json();

              if ('errors' in data) {
                setErrors(data.errors);
                return;
              }
            }}
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
                maxLength={200}
                value={description}
                onChange={(event) => setDescription(event.currentTarget.value)}
              />
              <div
                data-text="banner upload"
                className="host-form-image-container"
              >
                <input
                  className="host-form-image"
                  placeholder="Image URL"
                  type="file"
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

              <button className="host-form-confirm-button">Lets do it!</button>
              <div>{errors.toString()}</div>
            </div>
          </form>
        </div>
        <div className="map-container">
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
            <SetPin />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
