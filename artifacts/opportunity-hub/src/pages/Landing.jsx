import { Link } from "react-router-dom";

const features = [
  {
    title: "Competitive Exams",
    desc: "JEE, NEET, NDA, CLAT, GATE — track every major Indian entrance exam.",
    color: "bg-indigo-50 text-indigo-700",
  },
  {
    title: "Scholarships",
    desc: "INSPIRE, NMMS, HDFC, Reliance — never miss a funding opportunity.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Olympiads",
    desc: "IMO, NSO, IEO, NTSE, IOQM — practice with curated mini-quizzes.",
    color: "bg-amber-50 text-amber-700",
  },
  {
    title: "Internships & Hackathons",
    desc: "GSoC, SIH, IIT summer programs, Microsoft Engage — build your portfolio.",
    color: "bg-violet-50 text-violet-700",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center text-white font-bold">
              O
            </div>
            <span className="font-bold text-gray-900">OpportunityHub</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 text-center">
        <span className="inline-block px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-5">
          For Indian students • Class 8 to UG
        </span>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-5">
          Discover every <span className="text-indigo-600">opportunity</span>,
          <br className="hidden md:block" />
          before the deadline.
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Competitive exams, scholarships, olympiads, internships — all in one
          dashboard. Track deadlines, take quizzes, and never miss your chance.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            to="/register"
            className="px-6 py-3 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md"
          >
            Create free account
          </Link>
          <Link
            to="/login"
            className="px-6 py-3 text-base font-semibold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-xl"
          >
            Sign in
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-6">
          Try the demo: <span className="font-mono">student@opportunityhub.com / student123</span>
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="rounded-2xl border border-gray-100 p-5 hover:shadow-lg transition"
          >
            <div
              className={`w-10 h-10 rounded-xl ${f.color} font-bold flex items-center justify-center mb-3`}
            >
              {f.title.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-900 mb-1.5">{f.title}</h3>
            <p className="text-sm text-gray-600">{f.desc}</p>
          </div>
        ))}
      </section>

      <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-500">
        Built with React, Node, Express & MongoDB · OpportunityHub
      </footer>
    </div>
  );
}
