import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api";

interface Site {
  id: string;
  name: string;
  location: string;
}

export default function UserDashboard() {
  const { token } = useAuth();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSites = async () => {
      if (!token) return;

      try {
        setLoading(true);
        const res = await API.get<Site[]>("/user/sites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSites(res.data);
      } catch (err: any) {
        console.error("Error fetching sites:", err);
        setError(err?.response?.data?.message || "Failed to load sites");
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, [token]);

  if (loading) return <p className="text-center mt-10">Loading sites...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Assigned Sites</h1>
      {sites.length === 0 ? (
        <p>No sites assigned to you.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div
              key={site.id}
              className="p-4 rounded-xl shadow-md bg-white/5 border border-white/10"
            >
              <h2 className="text-lg font-semibold">{site.name}</h2>
              <p className="text-sm text-gray-400">{site.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
