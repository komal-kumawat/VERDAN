import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface Site {
    siteId: string;
    siteName: string;
    location: string;
    status: "Active" | "Inactive";
}

export default function UserDashboard() {
    const { name, logout } = useAuth();
    const [sites, setSites] = useState<Site[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Close dropdown if clicked outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Hardcoded sites
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            const hardcodedSites: Site[] = [
                { siteId: "S001", siteName: "Jaipur Central Park", location: "Jaipur, Rajasthan", status: "Active" },
                { siteId: "S002", siteName: "Cyber Hub", location: "Gurugram, Haryana", status: "Inactive" },
                { siteId: "S003", siteName: "Tech Valley", location: "Bangalore, Karnataka", status: "Active" },
            ];
            setSites(hardcodedSites);
            setLoading(false);
        }, 1000);
    }, []);

    if (loading) return <p className="text-center mt-10 text-gray-700">Loading sites...</p>;
    if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

    const handleProfile = () => navigate("/profile");
    const handleSetting = () => navigate("/setting");
    const handleLogout = () => {
        logout;
        navigate("/");
    }
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900">
            {/* Navbar */}
            <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center sm:px-20 md:px-50">
                <h1 className="text-xl font-semibold tracking-wide">Verdan </h1>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <div
                        className="flex items-center gap-3 bg-gray-100 px-3 py-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <FaUserCircle className="text-3xl text-gray-700" />
                        <span className="text-sm font-medium">
                            Hi, {name ? name : "User"}
                        </span>
                    </div>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 animate-fade-in">
                            <div className="px-4 py-3 border-b border-gray-200">
                                <p className="text-sm font-semibold">{name || "User"}</p>
                                <p className="text-xs text-gray-500">user@verdan.com</p>
                            </div>
                            <ul className="flex flex-col text-sm">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleProfile}>Profile</li>
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={handleSetting}>Settings</li>
                                <li
                                    className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </nav>

            {/* Assigned Sites */}
            <div className="p-6 sm:px-20 md:px-50">
                <h1 className="text-2xl font-bold mb-6">Assigned Sites</h1>
                {sites.length === 0 ? (
                    <p>No sites assigned to you.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-6">
                        {sites.map((site) => (
                            <div
                                key={site.siteId}
                                className="p-4 rounded-xl shadow-sm bg-white border border-gray-200 flex justify-between items-center"
                            >
                                <div>
                                    <h2 className="text-lg font-semibold">{site.siteName}</h2>
                                    <div className="flex flex-col md:flex-row md:gap-10 md:py-5 ">
                                        <p className="text-sm text-gray-500">ID: {site.siteId}</p>
                                        <p className="text-sm text-gray-500">{site.location}</p>
                                        <p className={`text-sm font-medium ${site.status === "Active" ? "text-green-600" : "text-red-600"}`}>
                                            {site.status}
                                        </p>
                                    </div>

                                </div>
                                <div className="flex flex-col gap-2 md:flex-row md:gap-10 md:py-5">
                                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">Add</button>
                                    <button className="px-3 py-1 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition">Update</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
