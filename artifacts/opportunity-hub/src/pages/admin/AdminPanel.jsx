import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  listOpportunities,
  deleteOpportunity,
  listUsers,
} from "../../api/opportunityApi.js";
import Button from "../../components/common/Button.jsx";
import Badge from "../../components/common/Badge.jsx";
import Loader from "../../components/common/Loader.jsx";
import { formatDate } from "../../utils/formatDate.js";

export default function AdminPanel() {
  const [opps, setOpps] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("opportunities");

  const reload = () => {
    setLoading(true);
    Promise.all([listOpportunities(), listUsers().catch(() => [])])
      .then(([o, u]) => {
        setOpps(o);
        setUsers(u);
      })
      .finally(() => setLoading(false));
  };

  useEffect(reload, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this opportunity? This cannot be undone.")) return;
    await deleteOpportunity(id);
    setOpps((arr) => arr.filter((o) => o._id !== id));
  };

  if (loading) return <Loader label="Loading admin data..." />;

  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-500">
            Manage opportunities and view registered users
          </p>
        </div>
        <Link to="/admin/new">
          <Button>+ New Opportunity</Button>
        </Link>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Stat label="Total Opportunities" value={opps.length} color="bg-indigo-50 text-indigo-700" />
        <Stat
          label="Total Users"
          value={users.length}
          color="bg-emerald-50 text-emerald-700"
        />
        <Stat
          label="Total Quizzes"
          value={opps.reduce((s, o) => s + (o.quiz?.length || 0), 0)}
          color="bg-amber-50 text-amber-700"
        />
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        <button
          onClick={() => setTab("opportunities")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === "opportunities"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Opportunities ({opps.length})
        </button>
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition ${
            tab === "users"
              ? "border-indigo-600 text-indigo-700"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Users ({users.length})
        </button>
      </div>

      {tab === "opportunities" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Title</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Category</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Deadline</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Quiz Q's</th>
                  <th className="px-4 py-3 font-medium text-gray-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {opps.map((o) => (
                  <tr key={o._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {o.title}
                    </td>
                    <td className="px-4 py-3">
                      <Badge category={o.category}>{o.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(o.deadline)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{o.quiz?.length || 0}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/admin/edit/${o._id}`}
                        className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mr-3"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(o._id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left">
                  <th className="px-4 py-3 font-medium text-gray-500">Name</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Email</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Role</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Level</th>
                  <th className="px-4 py-3 font-medium text-gray-500">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-700">{u.email}</td>
                    <td className="px-4 py-3">
                      <Badge
                        color={
                          u.role === "admin"
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-emerald-100 text-emerald-700"
                        }
                      >
                        {u.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{u.educationLevel}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {formatDate(u.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <span className={`px-2 py-0.5 text-xs font-semibold rounded-md ${color}`}>
          ●
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
    </div>
  );
}
