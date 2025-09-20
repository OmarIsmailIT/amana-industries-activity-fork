
"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// --- Import the data from the separate file ---
import { industryData } from './industryData';

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
 * MonthlyPerformanceChart Component
 * Renders a bar chart showing the monthly production data for three selected factories.
 */
const MonthlyPerformanceChart = ({ data }) => {
    // Select the first three factories with production data
    const factories = data.factory_data.slice(0, 3);

    // Combine the monthly data from the selected factories into a single array
    const combinedData = factories[0].production_level_2024.map((monthData, index) => {
        const obj = {
            month: monthData.month.slice(0, 3), // Shorten month name for X-axis
            [`Factory ${factories[0].name.split(' ')[2]}`]: monthData.value,
        };
        obj[`Factory ${factories[1].name.split(' ')[2]}`] = factories[1].production_level_2024[index].value;
        obj[`Factory ${factories[2].name.split(' ')[2]}`] = factories[2].production_level_2024[index].value;
        return obj;
    });

    // Custom Tooltip component to display full names
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-300 rounded shadow-lg text-sm">
                    <p className="font-bold mb-1">{label}</p>
                    {payload.map((p, i) => (
                        <p key={i} style={{ color: p.color }}>
                            {p.name}: {p.value} tons
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-gray-50 py-8 md:py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">Monthly Performance</h2>
                <div className="h-[400px] w-full p-4 bg-white rounded-lg shadow-xl">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={combinedData}
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey="month" label={{ value: 'Month', position: 'insideBottom', offset: -5 }} />
                            <YAxis label={{ value: 'Production (Tons)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ paddingTop: 20 }} />
                            <Bar dataKey={`Factory ${factories[0].name.split(' ')[2]}`} fill="#8884d8" />
                            <Bar dataKey={`Factory ${factories[1].name.split(' ')[2]}`} fill="#82ca9d" />
                            <Bar dataKey={`Factory ${factories[2].name.split(' ')[2]}`} fill="#ffc658" />
                        </BarChart>
                    </ResponsiveContainer>
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
                <MonthlyPerformanceChart data={data} />
            </main>
            <Footer />
        </div>
    );
}