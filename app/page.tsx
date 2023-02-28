import './map.scss';
import './globals.scss';
import Image from 'next/image';
import Map from './map';
import SearchBar from './SearchBar';

export default function Home() {
  return (
    <div>
      <Image
        src="/hero-banner.jpg"
        alt="Artistic Background Image"
        width={1920}
        height={732}
        layout="responsive"
      />

      <SearchBar />
      <Map />
    </div>
  );
}
