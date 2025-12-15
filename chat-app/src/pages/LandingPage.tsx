import { World } from "../components/ui/globe";
import { EncryptedText } from "../components/ui/encrypted-text";
import { useNavigate } from "react-router-dom";
import LandingPageContinue from "./LandingPageContinue";
import { CardStack } from "../components/ui/card-stack";

const CARDS = [
  {
    id: 0,
    name: "Manu Arora",
    designation: "Senior Software Engineer",
    content: (
      <p>
        These cards are amazing, I want to use them in my
        project. Framer motion is a godsend ngl tbh fam 🙏
      </p>
    ),
  },
  {
    id: 1,
    name: "Elon Musk",
    designation: "Senior Shitposter",
    content: (
      <p>
        I dont like this Twitter thing,{" "}
        deleting it right away because yolo. Instead, I
        would like to call it X.com so that it can easily
        be confused with adult sites.
      </p>
    ),
  },
  {
    id: 2,
    name: "Tyler Durden",
    designation: "Manager Project Mayhem",
    content: (
      <p>
        The first rule of
      Fight Club is that you do not talk about fight
        club. The second rule of
        Fight club is that you DO NOT TALK about fight
        club.
      </p>
    ),
  },
];

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
  autoRotateSpeed: 0.3,
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
    <div className="w-full min-h-screen flex flex-col justify-start -mt-10 top-0 items-center bg-[#0f1720] py-8">
      
    {/* navbar */}
      <div className="flex  justify-around bg-gray-700 opacity-85 hover:bg-gray-500 w-full mb-20 mt-4  fixed top-0 left-0 z-50">
        <div>
        Logo
      </div>
        
           <EncryptedText className="text-xl font-mono font-semibold mb-8 flex justify-center"
        text="Welcome to the Matrix, Cavlo"/>
        <div className="">
          <button
          onClick={() => navigate("/login")}
          className="bg-white text-black px-4 py-2 rounded"
        >
          Login
        </button>
        <button
          onClick={() => navigate("/cavlo")}
          className=" bg-white text-black px-4 py-2 rounded"
        >
          Cavlo
        </button>
        </div>
        <div>
        </div>
       
     
</div> 
      <div className="flex flex-col items-center gap-10 w-full pt-60">
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          <div
            className="rounded-full overflow-hidden"
            style={{ width: "560px", height: "560px" }}
          >
            <World globeConfig={defaultGlobeConfig} data={sampleData} />
          </div>

          <div className="flex justify-center items-center">
            <CardStack items={CARDS} />
          </div>
        </div>
      </div>
      
<hr className="border-gray-400 border-t-2 my-4"></hr>
     
     <LandingPageContinue/>
     </div>
     
 
  );
}
