import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createOpportunity,
  getOpportunity,
  updateOpportunity,
} from "../../api/opportunityApi.js";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";
import { CATEGORIES, LEVELS } from "../../utils/categories.js";

const empty = {
  title: "",
  category: "Scholarship",
  level: "All",
  description: "",
  eligibility: "",
  deadline: "",
  officialLink: "",
  syllabus: "",
  resources: "",
  pyqs: "",
  quiz: [],
};

function parseLines(s) {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
function parseLinkLines(s) {
  return parseLines(s).map((line) => {
    const [title, url] = line.split("|").map((p) => p.trim());
    return { title: title || line, url: url || "#" };
  });
}
function stringifyLinks(arr) {
  return (arr || []).map((r) => `${r.title} | ${r.url}`).join("\n");
}

export default function OpportunityForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    getOpportunity(id)
      .then((o) => {
        setForm({
          title: o.title,
          category: o.category,
          level: o.level,
          description: o.description,
          eligibility: o.eligibility,
          deadline: o.deadline ? new Date(o.deadline).toISOString().slice(0, 10) : "",
          officialLink: o.officialLink || "",
          syllabus: (o.syllabus || []).join("\n"),
          resources: stringifyLinks(o.resources),
          pyqs: stringifyLinks(o.pyqs),
          quiz: o.quiz || [],
        });
      })
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const addQuestion = () =>
    update("quiz", [
      ...form.quiz,
      { question: "", options: ["", "", "", ""], answer: 0 },
    ]);

  const updateQuestion = (qi, patch) => {
    const next = [...form.quiz];
    next[qi] = { ...next[qi], ...patch };
    update("quiz", next);
  };

  const removeQuestion = (qi) =>
    update("quiz", form.quiz.filter((_, i) => i !== qi));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        category: form.category,
        level: form.level,
        description: form.description,
        eligibility: form.eligibility,
        deadline: new Date(form.deadline).toISOString(),
        officialLink: form.officialLink,
        syllabus: parseLines(form.syllabus),
        resources: parseLinkLines(form.resources),
        pyqs: parseLinkLines(form.pyqs),
        quiz: form.quiz.filter((q) => q.question && q.options.every((o) => o)),
      };
      if (isEdit) await updateOpportunity(id, payload);
      else await createOpportunity(payload);
      navigate("/admin");
    } catch (err) {
      setError(err?.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-5 fade-in max-w-3xl">
      <Link to="/admin" className="text-sm text-indigo-600 hover:text-indigo-700">
        ← Back to admin
      </Link>
      <h2 className="text-2xl font-bold text-gray-900">
        {isEdit ? "Edit Opportunity" : "New Opportunity"}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <Section title="Basics">
          <Field label="Title" required>
            <input
              required
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              className="input"
            />
          </Field>
          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Category">
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className="input"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Level">
              <select
                value={form.level}
                onChange={(e) => update("level", e.target.value)}
                className="input"
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </Field>
            <Field label="Deadline" required>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={(e) => update("deadline", e.target.value)}
                className="input"
              />
            </Field>
          </div>
          <Field label="Description" required>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Eligibility" required>
            <input
              required
              value={form.eligibility}
              onChange={(e) => update("eligibility", e.target.value)}
              className="input"
            />
          </Field>
          <Field label="Official Link">
            <input
              type="url"
              value={form.officialLink}
              onChange={(e) => update("officialLink", e.target.value)}
              placeholder="https://..."
              className="input"
            />
          </Field>
        </Section>

        <Section title="Content (one item per line)">
          <Field label="Syllabus / Topics">
            <textarea
              rows={4}
              value={form.syllabus}
              onChange={(e) => update("syllabus", e.target.value)}
              placeholder={"Mathematics\nPhysics\nChemistry"}
              className="input font-mono text-xs"
            />
          </Field>
          <Field label='Resources (format: "Title | URL")'>
            <textarea
              rows={3}
              value={form.resources}
              onChange={(e) => update("resources", e.target.value)}
              placeholder={"NCERT Books | https://ncert.nic.in"}
              className="input font-mono text-xs"
            />
          </Field>
          <Field label='Past Papers (format: "Title | URL")'>
            <textarea
              rows={3}
              value={form.pyqs}
              onChange={(e) => update("pyqs", e.target.value)}
              className="input font-mono text-xs"
            />
          </Field>
        </Section>

        <Section
          title={`Quiz Questions (${form.quiz.length})`}
          right={
            <button
              type="button"
              onClick={addQuestion}
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              + Add question
            </button>
          }
        >
          {form.quiz.length === 0 ? (
            <p className="text-sm text-gray-500">
              No questions yet. Click "Add question" above.
            </p>
          ) : (
            <div className="space-y-4">
              {form.quiz.map((q, qi) => (
                <div
                  key={qi}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-500">
                      Question {qi + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qi)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    placeholder="Question text"
                    value={q.question}
                    onChange={(e) => updateQuestion(qi, { question: e.target.value })}
                    className="input"
                  />
                  {q.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`a-${qi}`}
                        checked={q.answer === oi}
                        onChange={() => updateQuestion(qi, { answer: oi })}
                        className="accent-emerald-600"
                      />
                      <input
                        placeholder={`Option ${oi + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const opts = [...q.options];
                          opts[oi] = e.target.value;
                          updateQuestion(qi, { options: opts });
                        }}
                        className="input flex-1"
                      />
                    </div>
                  ))}
                  <p className="text-xs text-gray-500">
                    Select the radio next to the correct answer.
                  </p>
                </div>
              ))}
            </div>
          )}
        </Section>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} variant="success">
            {saving ? "Saving..." : isEdit ? "Save changes" : "Create opportunity"}
          </Button>
          <Link to="/admin">
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </Link>
        </div>
      </form>

      <style>{`
        .input {
          width: 100%;
          padding: 0.625rem 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #e5e7eb;
          background: white;
          font-size: 0.875rem;
        }
        .input:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.15);
        }
      `}</style>
    </div>
  );
}

function Section({ title, right, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {right}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
