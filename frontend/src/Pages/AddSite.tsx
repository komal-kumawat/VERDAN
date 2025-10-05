import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { useNavigate } from "react-router-dom";

const AddSites = () => {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    image: "",
    status: "active",
    type: "",
    coordinates: { lat: "", lng: "" },
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

  if (!token || role !== "admin") {
    return (
      <p className="text-red-500 font-semibold text-center mt-10">
        Only admins can add a new site.
      </p>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData({
        ...formData,
        coordinates: { ...formData.coordinates, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.address) {
      setMessage({ type: "error", text: "Name and address are required" });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await API.post("/admin/sites/add", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage({ type: "success", text: "Site added successfully!" });
      setTimeout(()=>{
        navigate("/dashboard");
      } , 1000)
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err?.response?.data?.message || "Server error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md py-10 mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg transition-colors duration-500">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Add New Site
      </h2>

      {message && (
        <p
          className={`mb-6 text-center font-medium ${
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
          value={formData.name}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
        <input
          type="text"
          name="type"
          placeholder="Site Type"
          value={formData.type}
          onChange={handleChange}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="number"
            step="any"
            name="lat"
            placeholder="Latitude"
            value={formData.coordinates.lat}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
          <input
            type="number"
            step="any"
            name="lng"
            placeholder="Longitude"
            value={formData.coordinates.lng}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none flex-1 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Site"}
        </button>
      </form>
    </div>
  );
};

export default AddSites;
