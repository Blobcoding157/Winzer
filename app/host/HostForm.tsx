'use client';

import '../styles/map.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import L from 'leaflet';
import router from 'next/router';
import { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { EventResponseBodyPost } from '../api/events/route';
import icon from '../map/icon';

// id integer  PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
// title VARCHAR(50) NOT NULL,
// description VARCHAR(400) NOT NULL,
// event_date DATE NOT NULL,
// time_start TIME NOT NULL,
// time_end TIME NOT NULL,
// coordinates VARCHAR(100) NOT NULL,
// img_url VARCHAR(100)

export default function HostForm() {
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
  // user creation Page
  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const latitude = coordinates[0];
        const longitude = coordinates[1];

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
          }),
        });

        const data: EventResponseBodyPost = await response.json();

        if ('errors' in data) {
          setErrors(data.errors);
          return;
        }
      }}
    >
      <div>
        <input
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.currentTarget.value)}
        />
        <input
          placeholder="Description"
          value={description}
          onChange={(event) => setDescription(event.currentTarget.value)}
        />
        <input
          placeholder="Event Date"
          value={eventDate}
          type="date"
          onChange={(event) => setEventDate(event.currentTarget.value)}
        />
        <input
          placeholder="Time Start"
          value={eventStart}
          type="time"
          onChange={(event) => setEventStart(event.currentTarget.value)}
        />
        <input
          placeholder="Time End"
          type="time"
          value={eventEnd}
          onChange={(event) => setEventEnd(event.currentTarget.value)}
        />
        <input
          placeholder="Image URL"
          value={imgUrl}
          onChange={(event) => setImgUrl(event.currentTarget.value)}
        />
        <div>{errors.toString()}</div>
      </div>

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

        <SetPin />
      </MapContainer>
      <button
        onClick={() => {
          console.log('img url: ', typeof imgUrl, imgUrl);
          console.log('title: ', title);
          console.log('description: ', description);
          console.log('event date: ', typeof eventDate, eventDate);
          console.log('time start: ', typeof eventStart, eventStart);
          console.log('time end: ', typeof eventEnd, eventEnd);
          console.log(
            'coordinates: ',
            typeof coordinates[0],
            typeof coordinates[1],
            coordinates[0],
            coordinates[1],
          );
        }}
      >
        Lets do it!
      </button>
    </form>
  );
}
