'use client';
import './map.scss';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
import * as L from 'leaflet';
import { useEffect, useRef } from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const exampleTable = [
  {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    event_name: 'JohnParty',
    event_description:
      'this is a test event wow long text for testing testing testing test this is a test event wow long text for testing testing testing test',
    position: [51.505, -0.09],
  },
  {
    id: 2,
    firstName: 'Jane',
    lastName: 'Doe',
    event_name: 'JaneParty',
    event_description:
      'this is a test event wow long text for testing testing testing test this is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing testthis is a test event wow long text for testing testing testing test',
    position: [51.506, -0.09],
  },
];

export default function Map() {
  // const mapRef = useRef<L.Map>();

  // useEffect(() => {
  //   if (mapRef.current) {
  //     mapRef.current.setView([51.505, -0.09], 13);
  //   }
  // }, []);

  return (
    <div className="container">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={23}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
        />
        {/* <Marker position={[51.505, -0.09]}>
        <Popup>this is a popup</Popup>
      </Marker> */}

        {exampleTable.map((host) => {
          return (
            <Marker
              key={host.id}
              position={[host.position[0], host.position[1]]}
            >
              <Popup>
                <img className="popup" alt="" src="/wine-drive.gif" />
                {host.event_name}
                <hr />

                {host.event_description}
                <br />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
