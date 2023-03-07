import './styles/map.scss';
import './styles/globals.scss';
import Image from 'next/image';
import Map from './map/map';

export default function Home() {
  return (
    <div>
      <Image
        src="/hero-banner.jpg"
        alt="Artistic Background Image"
        className="hero-banner"
        width={1920}
        height={732}
        layout="responsive"
      />
      <div className="hero-banner-text">
        GPT please put some inspirational text here
      </div>
      <Map />
    </div>
  );
}
