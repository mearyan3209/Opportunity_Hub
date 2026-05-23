import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const CATEGORY_COLORS = {
  "School Olympiad": { bg: "bg-violet-500", light: "bg-violet-100", text: "text-violet-700", dot: "#7c3aed" },
  "UG Entrance":     { bg: "bg-indigo-500", light: "bg-indigo-100", text: "text-indigo-700", dot: "#4338ca" },
  "Scholarship":     { bg: "bg-emerald-500", light: "bg-emerald-100", text: "text-emerald-700", dot: "#059669" },
  "College/Skill":   { bg: "bg-amber-500", light: "bg-amber-100", text: "text-amber-700", dot: "#d97706" },
  "Internship":      { bg: "bg-rose-500", light: "bg-rose-100", text: "text-rose-700", dot: "#e11d48" },
};

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
function firstDayOf(y, m)  { return new Date(y, m, 1).getDay(); }
function toKey(d)           { return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; }
function today()            { return toKey(new Date()); }

export default function DeadlineCalendar() {
  const now = new Date();
  const [year, setYear]   = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [opps, setOpps]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null); // "YYYY-MM-DD"

  useEffect(() => {
  axios
    .get("http://localhost:5000/api/opportunities")
    .then((r) => {
      const data =
        Array.isArray(r.data)
          ? r.data
          : Array.isArray(r.data?.opportunities)
          ? r.data.opportunities
          : Array.isArray(r.data?.data)
          ? r.data.data
          : [];

      setOpps(data);
    })
    .catch((err) => {
      console.error("Calendar fetch error:", err);
      setOpps([]);
    })
    .finally(() => setLoading(false));
}, []);

  // Map date-key → list of opps
  const deadlineMap = useMemo(() => {
    const map = {};
    (Array.isArray(opps) ? opps : []).forEach((op) => {
      const dl = new Date(op.deadline);
      const key = toKey(dl);
      if (!map[key]) map[key] = [];
      map[key].push(op);
    });
    return map;
  }, [opps]);

  // Opps for selected day (or today if nothing selected yet)
  const selectedKey = selected ?? today();
  const selectedOpps = deadlineMap[selectedKey] ?? [];

  // Upcoming opps this month sorted by deadline
  const thisMonthUpcoming = useMemo(() => {
    const start = new Date(year, month, 1);
    const end   = new Date(year, month + 1, 0, 23, 59, 59);
    const nowTs = Date.now();
    return opps
      .filter(op => {
        const dl = new Date(op.deadline);
        return dl >= start && dl <= end && dl >= nowTs;
      })
      .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
  }, [opps, year, month]);

  // Expired opps — past deadline
  const expiredCount = (Array.isArray(opps) ? opps : []).filter(
  op => new Date(op.deadline) < Date.now()
).length;
  // Navigate months
  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
    setSelected(null);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
    setSelected(null);
  }

  // Build grid cells
  const totalDays = daysInMonth(year, month);
  const startDay  = firstDayOf(year, month);
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);

  const todayKey = today();

  function formatDate(key) {
    if (!key) return "";
    const [y, m, d] = key.split("-");
    return `${MONTHS[parseInt(m,10)-1]} ${parseInt(d,10)}, ${y}`;
  }

  function daysUntil(dl) {
    const diff = Math.ceil((new Date(dl) - Date.now()) / 86400000);
    if (diff < 0) return "Expired";
    if (diff === 0) return "Today!";
    if (diff === 1) return "Tomorrow";
    return `${diff} days left`;
  }

  function urgencyColor(dl) {
    const diff = Math.ceil((new Date(dl) - Date.now()) / 86400000);
    if (diff < 0) return "text-gray-400";
    if (diff <= 7) return "text-rose-600 font-bold";
    if (diff <= 30) return "text-amber-600 font-semibold";
    return "text-emerald-600";
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-gray-900">Deadline Calendar</h1>
        <p className="text-gray-500 text-sm mt-1">
          All {opps.length} opportunities plotted by registration deadline.
          {expiredCount > 0 && (
            <span className="ml-2 text-rose-500 font-medium">
              {expiredCount} expired — see below for what to do.
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* ── CALENDAR ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Month navigation */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-indigo-600 to-indigo-500">
              <button
                onClick={prevMonth}
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                ‹
              </button>
              <h2 className="text-lg font-bold text-white">
                {MONTHS[month]} {year}
              </h2>
              <button
                onClick={nextMonth}
                className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
              >
                ›
              </button>
            </div>

            {/* Day-of-week headers */}
            <div className="grid grid-cols-7 border-b border-gray-100">
              {DAYS.map(d => (
                <div key={d} className="py-2 text-center text-xs font-semibold text-gray-400 uppercase tracking-wide">
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-400 text-sm">Loading deadlines…</div>
            ) : (
              <div className="grid grid-cols-7">
                {cells.map((day, idx) => {
                  if (!day) return <div key={`empty-${idx}`} className="h-20 border-r border-b border-gray-50 bg-gray-50/50" />;
                  const key = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                  const dayOpps = deadlineMap[key] ?? [];
                  const isToday = key === todayKey;
                  const isSelected = key === selectedKey;

                  return (
                    <button
                      key={key}
                      onClick={() => setSelected(key)}
                      className={`h-20 border-r border-b border-gray-100 p-1.5 text-left flex flex-col transition relative group
                        ${isSelected ? "bg-indigo-50 ring-2 ring-inset ring-indigo-400" : "hover:bg-gray-50"}
                        ${idx % 7 === 6 ? "border-r-0" : ""}
                      `}
                    >
                      <span className={`text-xs font-semibold mb-1 w-6 h-6 flex items-center justify-center rounded-full transition
                        ${isToday ? "bg-indigo-600 text-white" : isSelected ? "text-indigo-700" : "text-gray-700"}
                      `}>
                        {day}
                      </span>
                      <div className="flex flex-wrap gap-0.5">
                        {dayOpps.slice(0, 3).map(op => {
                          const c = CATEGORY_COLORS[op.category] ?? CATEGORY_COLORS["UG Entrance"];
                          return (
                            <span key={op._id} className={`inline-block w-2 h-2 rounded-full ${c.bg}`} title={op.title} />
                          );
                        })}
                        {dayOpps.length > 3 && (
                          <span className="text-gray-400 text-xs">+{dayOpps.length - 3}</span>
                        )}
                      </div>
                      {dayOpps.length > 0 && !isSelected && (
                        <span className="absolute bottom-1 right-1.5 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition">
                          {dayOpps.length}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Category legend */}
          <div className="mt-4 flex flex-wrap gap-3">
            {Object.entries(CATEGORY_COLORS).map(([cat, c]) => (
              <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-600">
                <span className={`w-3 h-3 rounded-full ${c.bg}`} />
                {cat}
              </div>
            ))}
          </div>

          {/* Expired / past-deadline info banner */}
          {expiredCount > 0 && (
            <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h3 className="font-bold text-amber-800 text-sm mb-2">
                📋 What to do with {expiredCount} expired deadlines
              </h3>
              <ul className="space-y-1.5 text-sm text-amber-700">
                <li className="flex gap-2">
                  <span className="font-bold">1.</span>
                  <span><strong>Don't panic</strong> — many exams run annually. The next cycle's dates are usually announced 2–4 months later. Keep them saved so you catch the next round.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">2.</span>
                  <span><strong>Start preparing now</strong> — use the built-in quiz for each opportunity to practise the syllabus even between cycles.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">3.</span>
                  <span><strong>Admins can update</strong> — log in as admin and edit the opportunity to set the next cycle's deadline. It reappears as upcoming for all students.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">4.</span>
                  <span><strong>Past entries are kept as records</strong> — they show in your dashboard history and quiz scores so your preparation record isn't lost.</span>
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ──────────────────────────────────── */}
        <div className="w-full xl:w-80 flex flex-col gap-5">
          {/* Selected day panel */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`px-5 py-3 border-b border-gray-100 ${selectedOpps.length > 0 ? "bg-indigo-50" : "bg-gray-50"}`}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Selected Day</p>
              <p className="font-bold text-gray-900 text-sm">{formatDate(selectedKey)}</p>
            </div>
            {selectedOpps.length === 0 ? (
              <div className="px-5 py-8 text-center">
                <div className="text-3xl mb-2">📅</div>
                <p className="text-sm text-gray-400">No deadlines on this day.</p>
                <p className="text-xs text-gray-400 mt-1">Click a dot on the calendar to explore.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {selectedOpps.map(op => {
                  const c = CATEGORY_COLORS[op.category] ?? CATEGORY_COLORS["UG Entrance"];
                  const past = new Date(op.deadline) < Date.now();
                  return (
                    <li key={op._id} className="px-5 py-3 flex items-start gap-3">
                      <span className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.bg}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm font-semibold leading-tight ${past ? "text-gray-400" : "text-gray-900"}`}>{op.title}</p>
                        <span className={`text-xs ${c.light} ${c.text} px-2 py-0.5 rounded-full mt-1 inline-block`}>{op.category}</span>
                        {past && <p className="text-xs text-rose-400 mt-1">Deadline passed</p>}
                      </div>
                      <Link
                        to={`/opportunities/${op._id}`}
                        className="flex-shrink-0 text-indigo-600 text-xs font-semibold hover:underline"
                      >
                        View →
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* This month upcoming */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Upcoming This Month</p>
                <p className="font-bold text-gray-900 text-sm">{MONTHS[month]} {year}</p>
              </div>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-full">
                {thisMonthUpcoming.length}
              </span>
            </div>
            {thisMonthUpcoming.length === 0 ? (
              <div className="px-5 py-6 text-center">
                <p className="text-sm text-gray-400">No upcoming deadlines this month.</p>
                <button onClick={nextMonth} className="mt-2 text-xs text-indigo-600 hover:underline">
                  Jump to next month →
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50 max-h-96 overflow-y-auto">
                {thisMonthUpcoming.map(op => {
                  const c = CATEGORY_COLORS[op.category] ?? CATEGORY_COLORS["UG Entrance"];
                  const dl = new Date(op.deadline);
                  return (
                    <li
                      key={op._id}
                      className="px-5 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer transition"
                      onClick={() => setSelected(toKey(dl))}
                    >
                      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${c.bg}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{op.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {dl.getDate()} {MONTHS[dl.getMonth()]}
                        </p>
                      </div>
                      <span className={`text-xs flex-shrink-0 ${urgencyColor(op.deadline)}`}>
                        {daysUntil(op.deadline)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(CATEGORY_COLORS).map(([cat, c]) => {
              const count = opps.filter(op => op.category === cat).length;
              return (
                <div key={cat} className={`${c.light} rounded-xl p-3`}>
                  <p className={`text-xl font-extrabold ${c.text}`}>{count}</p>
                  <p className="text-xs text-gray-600 leading-tight mt-0.5">{cat}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
