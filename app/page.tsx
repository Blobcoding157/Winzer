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
        width={1920}
        height={732}
        layout="responsive"
      />
      GPT please put some inspirational text here
      <Map />
    </div>
  );
}
