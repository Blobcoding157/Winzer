'use client';

import '../styles/map.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css';
import 'leaflet-defaulticon-compatibility';
import { AdvancedImage } from '@cloudinary/react';
import { CloudinaryImage } from '@cloudinary/url-gen';
import { fill } from '@cloudinary/url-gen/actions/resize';
import L from 'leaflet';
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

  const myImage = new CloudinaryImage('sample', {
    cloudName: 'dunwzknvb',
  }).resize(fill().width(100).height(100));

  return (
    <div>
      <form
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
            onChange={(event) =>
              setEventDate(event.currentTarget.value.toString())
            }
          />
          <input
            placeholder="Time Start"
            value={eventStart}
            type="time"
            onChange={(event) =>
              setEventStart(event.currentTarget.value.toString())
            }
          />
          <input
            placeholder="Time End"
            type="time"
            value={eventEnd}
            onChange={(event) => setEventEnd(event.currentTarget.value)}
          />
          <input
            placeholder="Image URL"
            type="text"
            value={imgUrl}
            onChange={(event) => setImgUrl(event.currentTarget.value)}
          />
          <button>Lets do it!</button>
          <AdvancedImage cldImg={myImage} />
          <div>{errors.toString()}</div>
        </div>
      </form>
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
    </div>
  );
}
