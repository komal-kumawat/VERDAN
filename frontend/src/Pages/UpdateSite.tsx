import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

interface Site {
  _id: string;
  name: string;
  address: string;
  image: string;
  type: string;
  status: "active" | "inactive";
  coordinates: { lat: number; lng: number };
}

const UpdateSite = () => {
  const { token } = useAuth();
  const { siteId } = useParams<{ siteId: string }>(); // siteId from URL
  const navigate = useNavigate();

  const [siteData, setSiteData] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  // Fetch site details
  useEffect(() => {
    const fetchSite = async () => {
      if (!token || !siteId) return;

      try {
        const res = await API.get<Site>(`/admin/sites/${siteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSiteData(res.data);
      } catch (err: any) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to fetch site data." });
      } finally {
        setLoading(false);
      }
    };

    fetchSite();
  }, [token, siteId]);

  if (loading) return <p className="text-center mt-10">Loading site data...</p>;
  if (!siteData) return <p className="text-center mt-10 text-red-500">Site not found.</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "lat" || name === "lng") {
      setSiteData({
        ...siteData,
        coordinates: { ...siteData.coordinates, [name]: parseFloat(value) },
      });
    } else {
      setSiteData({ ...siteData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteData.name || !siteData.address) {
      setMessage({ type: "error", text: "Name and address are required." });
      return;
    }

    setUpdating(true);
    setMessage(null);

    try {
      await API.put(`/admin/sites/${siteId}`, siteData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage({ type: "success", text: "Site updated successfully!" });

      // Redirect back to dashboard after update
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Failed to update site." });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Update Site
      </h2>

      {message && (
        <p
          className={`mb-4 text-center font-medium ${
            message.type === "error" ? "text-red-500" : "text-green-500"
          }`}
        >
          {message.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          placeholder="Site Name"
          value={siteData.name}
          onChange={handleChange}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={siteData.address}
          onChange={handleChange}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={siteData.image}
          onChange={handleChange}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="text"
          name="type"
          placeholder="Site Type"
          value={siteData.type}
          onChange={handleChange}
          className="p-3 border rounded focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            step="any"
            name="lat"
            placeholder="Latitude"
            value={siteData.coordinates.lat}
            onChange={handleChange}
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 flex-1 dark:bg-gray-700 dark:text-white"
          />
          <input
            type="number"
            step="any"
            name="lng"
            placeholder="Longitude"
            value={siteData.coordinates.lng}
            onChange={handleChange}
            className="p-3 border rounded focus:ring-2 focus:ring-blue-500 flex-1 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={updating}
          className="mt-4 bg-yellow-500 text-white py-3 rounded hover:bg-yellow-600 transition disabled:opacity-50"
        >
          {updating ? "Updating..." : "Update Site"}
        </button>
      </form>
    </div>
  );
};

export default UpdateSite;
