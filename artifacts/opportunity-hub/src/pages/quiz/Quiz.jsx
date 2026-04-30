import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getQuiz, submitQuiz } from "../../api/quizApi.js";
import Button from "../../components/common/Button.jsx";
import Loader from "../../components/common/Loader.jsx";

export default function Quiz() {
  const { opportunityId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getQuiz(opportunityId)
      .then((q) => {
        setData(q);
        setAnswers(new Array(q.quiz.length).fill(-1));
      })
      .catch((e) =>
        setError(e?.response?.data?.message || "Failed to load quiz"),
      );
  }, [opportunityId]);

  const handleSelect = (qi, oi) => {
    setAnswers((a) => {
      const next = [...a];
      next[qi] = oi;
      return next;
    });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const r = await submitQuiz(opportunityId, answers);
      setResult(r);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (e) {
      setError(e?.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl">
        {error}
      </div>
    );
  }
  if (!data) return <Loader label="Loading quiz..." />;

  if (result) {
    const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;
    return (
      <div className="space-y-6 fade-in">
        <div className="bg-gradient-to-r from-indigo-600 to-emerald-500 rounded-2xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">Quiz Complete</p>
          <h2 className="text-3xl font-bold mb-1">{data.title}</h2>
          <p className="text-4xl font-bold mt-3">
            {result.score} / {result.total}{" "}
            <span className="text-2xl opacity-80">({pct}%)</span>
          </p>
        </div>

        <div className="space-y-4">
          {result.review.map((q, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
            >
              <div className="flex items-start gap-2 mb-3">
                <span
                  className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    q.correct
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {i + 1}
                </span>
                <h3 className="font-medium text-gray-900">{q.question}</h3>
              </div>
              <div className="space-y-1.5 ml-9">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctAnswer;
                  const isUser = oi === q.userAnswer;
                  let cls = "border-gray-200 bg-white text-gray-700";
                  if (isCorrect) cls = "border-emerald-300 bg-emerald-50 text-emerald-800";
                  else if (isUser) cls = "border-red-300 bg-red-50 text-red-800";
                  return (
                    <div
                      key={oi}
                      className={`px-3 py-2 rounded-lg border text-sm ${cls}`}
                    >
                      {opt}
                      {isCorrect && (
                        <span className="ml-2 text-xs font-semibold">✓ correct</span>
                      )}
                      {isUser && !isCorrect && (
                        <span className="ml-2 text-xs font-semibold">your answer</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => navigate(`/opportunities/${opportunityId}`)}>
            Back to opportunity
          </Button>
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Retake quiz
          </Button>
        </div>
      </div>
    );
  }

  const answered = answers.filter((a) => a !== -1).length;

  return (
    <div className="space-y-5 fade-in">
      <Link
        to={`/opportunities/${opportunityId}`}
        className="text-sm text-indigo-600 hover:text-indigo-700"
      >
        ← Back
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <p className="text-sm text-indigo-600 font-semibold uppercase tracking-wide mb-1">
          Practice Quiz
        </p>
        <h2 className="text-2xl font-bold text-gray-900">{data.title}</h2>
        <p className="text-sm text-gray-500 mt-2">
          {data.quiz.length} questions · {answered} answered
        </p>
        <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 transition-all"
            style={{ width: `${(answered / data.quiz.length) * 100}%` }}
          />
        </div>
      </div>

      {data.quiz.map((q, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm"
        >
          <div className="flex items-start gap-2 mb-4">
            <span className="shrink-0 w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
              {i + 1}
            </span>
            <h3 className="font-medium text-gray-900">{q.question}</h3>
          </div>
          <div className="space-y-2 ml-9">
            {q.options.map((opt, oi) => (
              <label
                key={oi}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-pointer transition ${
                  answers[i] === oi
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  name={`q-${i}`}
                  checked={answers[i] === oi}
                  onChange={() => handleSelect(i, oi)}
                  className="accent-indigo-600"
                />
                <span className="text-sm text-gray-800">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 -mx-4 md:-mx-8 flex items-center justify-between">
        <span className="text-sm text-gray-600">
          {answered} of {data.quiz.length} answered
        </span>
        <Button
          onClick={handleSubmit}
          disabled={submitting || answered === 0}
          variant="success"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </Button>
      </div>
    </div>
  );
}
