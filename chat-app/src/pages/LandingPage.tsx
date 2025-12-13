import { World } from "../components/ui/globe";
import { EncryptedText } from "../components/ui/encrypted-text";
import { useNavigate } from "react-router-dom";
import { WorldMap } from "../components/ui/world-map";

const defaultGlobeConfig = {
  pointSize: 1,
  globeColor: "#1d072e",
  showAtmosphere: false,
  atmosphereColor: "#586aa8",
  atmosphereAltitude: 0.1,
  emissive: "#000000",
  emissiveIntensity: 0.1,
  shininess: 0.9,
  polygonColor: "rgba(255,255,255,0.7)",
  ambientLight: "#ffffff",
  directionalLeftLight: "#ffffff",
  directionalTopLight: "#ffffff",
  pointLight: "#ffffff",
  arcTime: 2000,
  arcLength: 0.9,
  rings: 1,
  maxRings: 3,
  initialPosition: { lat: 20, lng: 0 },
  autoRotate: true,
  autoRotateSpeed: 0.4,
};

const sampleData = [
  {
    order: 1,
    startLat: 37.7749,
    startLng: -122.4194,
    endLat: 51.5074,
    endLng: -0.1278,
    arcAlt: 0.6,
    color: "#ff0000",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#0f1720] 
    m-0 p-0 mt-0 top-0">
    {/* navbar */}
      <div className="flex justify-end pr-10 w-full  -mt-20 top-0 bg ">
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-white text-black px-4 py-2 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/cavlo")}
          className="mt-4 bg-white text-black px-4 py-2 rounded"
        >
          Cavlo
        </button>
      </div>  
      <EncryptedText
        className="text-xl font-mono font-semibold"
        text="Welcome to the Matrix, Cavlo"/>

      <div
        style={{
          width: "80vmin",
          height: "80vmin",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <World globeConfig={defaultGlobeConfig} data={sampleData} />

      </div>
       <WorldMap
        dots={[
          {
            start: {
              lat: 64.2008,
              lng: -149.4937,
            }, // Alaska (Fairbanks)
            end: {
              lat: 34.0522,
              lng: -118.2437,
            }, // Los Angeles
          },
          {
            start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
            end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
          },
          {
            start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
            end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
          },
          {
            start: { lat: 51.5074, lng: -0.1278 }, // London
            end: { lat: 28.6139, lng: 77.209 }, // New Delhi
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
          },
          {
            start: { lat: 28.6139, lng: 77.209 }, // New Delhi
            end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
          },
        ]}
      />
    </div>
  );
}
