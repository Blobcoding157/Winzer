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
  const [timeStart, setTimeStart] = useState('');
  const [timeEnd, setTimeEnd] = useState('');
  const [coordinates, setCoordinates] = useState([]);
  const [imgUrl, setImgUrl] = useState('');

  const center = [48.1931, 16.31222];

  function SetPin() {
    const map = useMapEvents({
      click: (e) => {
        const { lat, lng } = e.latlng;
        if (coordinates) {
          map.removeLayer(coordinates);
        }
        const newMarker = L.marker([lat, lng], { icon }).addTo(map);
        setCoordinates(newMarker);
      },
    });
    return null;
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        const response = await fetch('/api/host', {
          method: 'POST',
          body: JSON.stringify({
            title,
            description,
            eventDate,
            timeStart,
            timeEnd,
            coordinates,
            imgUrl,
          }),
        });

        const data: EventResponseBodyPost = await response.json();

        if (data.error) {
          alert(data.error);
        } else {
          alert('Event created!');
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
          onChange={(event) => setEventDate(event.currentTarget.value)}
        />
        <input
          placeholder="Time Start"
          value={timeStart}
          onChange={(event) => setTimeStart(event.currentTarget.value)}
        />
        <input
          placeholder="Time End"
          value={timeEnd}
          onChange={(event) => setTimeEnd(event.currentTarget.value)}
        />
        <input
          placeholder="Image URL"
          value={imgUrl}
          onChange={(event) => setImgUrl(event.currentTarget.value)}
        />
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
      <button>Lets do it!</button>
    </form>
  );
}
