// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
//       <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={180}
//           height={38}
//           priority
//         />
//         <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
//           <li className="mb-2 tracking-[-.01em]">
//             Get started by editing{" "}
//             <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
//               app/page.tsx
//             </code>
//             .
//           </li>
//           <li className="tracking-[-.01em]">
//             Save and see your changes instantly.
//           </li>
//         </ol>

//         <div className="flex gap-4 items-center flex-col sm:flex-row">
//           <a
//             className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={20}
//               height={20}
//             />
//             Deploy now
//           </a>
//           <a
//             className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Read our docs
//           </a>
//         </div>
//       </main>
//       <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/file.svg"
//             alt="File icon"
//             width={16}
//             height={16}
//           />
//           Learn
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/window.svg"
//             alt="Window icon"
//             width={16}
//             height={16}
//           />
//           Examples
//         </a>
//         <a
//           className="flex items-center gap-2 hover:underline hover:underline-offset-4"
//           href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           <Image
//             aria-hidden
//             src="/globe.svg"
//             alt="Globe icon"
//             width={16}
//             height={16}
//           />
//           Go to nextjs.org →
//         </a>
//       </footer>
//     </div>
//   );
// }


"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- DATA ---
// This is the sample data you provided. In a real application, this would come from an API.
const industryData = {
    "message": "Amana Industries factory data retrieved successfully",
    "company_info": {
        "name": "Amana Industries",
        "founded": "2016",
        "headquarters": "Amman, Jordan",
        "industry": "Textile Manufacturing",
        "description": "Leading textile manufacturer operating across Jordan and Egypt, specializing in sustainable and high-quality fabric production."
    },
    "factory_data": [
        { "id": 1, "name": "Amana Textiles Amman", "location": { "city": "Amman", "country": "Jordan", "latitude": 31.9454, "longitude": 35.9284 }, "status": "operational" },
        { "id": 2, "name": "Amana Spinning Irbid", "location": { "city": "Irbid", "country": "Jordan", "latitude": 32.5556, "longitude": 35.85 }, "status": "operational" },
        { "id": 3, "name": "Amana Weaving Zarqa", "location": { "city": "Zarqa", "country": "Jordan", "latitude": 32.0728, "longitude": 36.0876 }, "status": "maintenance" },
        { "id": 4, "name": "Amana Premium Aqaba", "location": { "city": "Aqaba", "country": "Jordan", "latitude": 29.532, "longitude": 35.0063 }, "status": "operational" },
        { "id": 5, "name": "Amana Industries Cairo", "location": { "city": "Cairo", "country": "Egypt", "latitude": 30.0444, "longitude": 31.2357 }, "status": "operational" },
        { "id": 6, "name": "Amana Cotton Alexandria", "location": { "city": "Alexandria", "country": "Egypt", "latitude": 31.2001, "longitude": 29.9187 }, "status": "maintenance" },
        { "id": 7, "name": "Amana Synthetic Giza", "location": { "city": "Giza", "country": "Egypt", "latitude": 30.0131, "longitude": 31.2089 }, "status": "operational" },
        { "id": 8, "name": "Amana Finishing Suez", "location": { "city": "Suez", "country": "Egypt", "latitude": 29.9668, "longitude": 32.5498 }, "status": "operational" },
        { "id": 9, "name": "Amana Export Damietta", "location": { "city": "Damietta", "country": "Egypt", "latitude": 31.4165, "longitude": 31.8133 }, "status": "operational" },
        { "id": 10, "name": "Amana Research Aswan", "location": { "city": "Aswan", "country": "Egypt", "latitude": 24.0889, "longitude": 32.8998 }, "status": "maintenance" }
    ]
};

// --- SVG ICONS for Map Markers ---
const operationalIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="green" width="36px" height="36px">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`;

const maintenanceIconSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red" width="36px" height="36px">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>`;


// --- COMPONENTS ---

/**
 * Header Component
 * Displays the navigation bar, company title, and description.
 */
const Header = ({ companyInfo }) => {
    return (
        <header className="bg-white shadow-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Navigation Bar */}
                <nav className="flex items-center justify-between h-16 border-b border-gray-200">
                    <div className="flex items-center">
                        <span className="font-bold text-xl text-gray-800">Logo</span>
                    </div>
                    <div className="flex items-center">
                         <button className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition">
                            Menu
                        </button>
                    </div>
                </nav>
                {/* Title and Subtitle */}
                <div className="text-center py-8 md:py-12">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                        {companyInfo.name}
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-500">
                        {companyInfo.description}
                    </p>
                </div>
            </div>
        </header>
    );
};

/**
 * Map Component
 * Renders an interactive map with markers for each factory.
 * NOTE: This component is client-side only.
 */
const MapComponent = ({ factories }) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);
    
    // Define custom icons for Leaflet
    const operationalIcon = L.divIcon({
        html: operationalIconSvg,
        className: '', // remove default leaflet styles
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });

    const maintenanceIcon = L.divIcon({
        html: maintenanceIconSvg,
        className: '',
        iconSize: [36, 36],
        iconAnchor: [18, 36],
        popupAnchor: [0, -36]
    });

    // Calculate center of the map
    const latitudes = factories.map(f => f.location.latitude);
    const longitudes = factories.map(f => f.location.longitude);
    const centerLat = latitudes.reduce((a, b) => a + b, 0) / latitudes.length;
    const centerLng = longitudes.reduce((a, b) => a + b, 0) / longitudes.length;

    if (!isClient) {
        return <div className="flex items-center justify-center h-96 bg-gray-100 text-gray-500">Loading map...</div>;
    }

    return (
         <div className="bg-gray-50 py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Factory Statuses</h2>
                <div className="h-[500px] w-full rounded-lg shadow-xl overflow-hidden">
                    <MapContainer center={[centerLat, centerLng]} zoom={6} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        {factories.map(factory => (
                            <Marker
                                key={factory.id}
                                position={[factory.location.latitude, factory.location.longitude]}
                                icon={factory.status === 'operational' ? operationalIcon : maintenanceIcon}
                            >
                                <Popup>
                                    <div className="font-sans">
                                        <h3 className="font-bold text-base mb-1">{factory.name}</h3>
                                        <p className="text-gray-600 text-sm">{factory.location.city}, {factory.location.country}</p>
                                        <p className={`text-sm font-semibold mt-2 ${factory.status === 'operational' ? 'text-green-600' : 'text-red-600'}`}>
                                            Status: <span className="capitalize">{factory.status}</span>
                                        </p>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};


/**
 * Footer Component
 * A simple placeholder for the page footer.
 */
const Footer = () => {
    return (
        <footer className="bg-gray-800 mt-auto">
            <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-400">
                    Footer
                </p>
            </div>
        </footer>
    );
};


/**
 * Main Page Component
 * This is the entry point of the page, assembling all other components.
 */
// export default function AmanaIndustriesPage() {
export default function Home() {
    const [data] = useState(industryData);

    if (!data) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <Header companyInfo={data.company_info} />
            <main className="flex-grow">
                <MapComponent factories={data.factory_data} />
            </main>
            <Footer />
        </div>
    );
}
