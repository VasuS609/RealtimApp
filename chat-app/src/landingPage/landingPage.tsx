import { World } from "../components/ui/globe";
import { EncryptedText } from "../components/ui/encrypted-text";
import { useNavigate } from "react-router-dom";

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
  autoRotateSpeed: .4,
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
    <div className="w-full h-screen flex flex-col justify-center items-center bg-[#0f1720]">
      <nav className="">
        <EncryptedText className="text-xl font-mono font-semibold antiliased" text="Welcome to the Matrix" />
      </nav>

      <button
        onClick={() => navigate("/login")}
        className="px-4 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Login
      </button>

      <div
        style={{
          width: "80vmin",
          height: "80vmin",
          borderRadius: "50%",
          overflow: "hidden",
          boxShadow: "inset 0 0 60px rgba(0,0,0,0.6), 0 10px 40px rgba(0,0,0,0.6)",
        }}
      >
        <World globeConfig={defaultGlobeConfig} data={sampleData} />
      </div>
    </div>
  );
}