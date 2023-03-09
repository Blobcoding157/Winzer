import 'react-leaflet-geosearch/node_modules/leaflet-geosearch/assets/css/leaflet.css';
import { GeoSearchControl } from 'leaflet-geosearch';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function SearchControl(props) {
  const map = useMap();

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider: props.provider,
      ...props,
    });

    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map, props]);

  return null;
}
