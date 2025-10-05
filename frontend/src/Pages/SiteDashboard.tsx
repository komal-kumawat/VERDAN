import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";

interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  designation?: string;
  gender?: string;
}

const SiteDashboard = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token || !siteId) return;

    const fetchTeam = async () => {
      setLoading(true);
      try {
        const res = await API.get<TeamMember[]>(`/admin/site/team?siteId=${siteId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTeam(res.data);
      } catch (err: any) {
        console.error(err);
        setError(err?.response?.data?.message || "Failed to fetch team members");
      } finally {
        setLoading(false);
      }
    };

    fetchTeam();
  }, [token, siteId]);

  if (!token) return navigate("/signin");
  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="font-bold text-lg">Site Dashboard</h1>
        <div className="text-sm text-gray-500 px-10">Site ID: {siteId}</div>
        <button
          onClick={handleLogout}
          className="ml-auto px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </nav>

      {/* Team Members */}
      <div className="max-w-3xl mx-auto p-6 mt-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Team Members</h2>

        {team.length === 0 ? (
          <p className="mt-4 text-center text-gray-600">No team members added yet.</p>
        ) : (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {team.map((member) => (
              <div
                key={member._id}
                className="p-4 border rounded-lg shadow-sm flex flex-col gap-1 hover:shadow-md transition"
              >
                <p className="font-semibold text-gray-800">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
                <p className="text-sm text-gray-600">{member.designation || member.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiteDashboard;
