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
    const isPerfect = pct === 100;
    const isGood = pct >= 75;
    const isFair = pct >= 50;
    
    return (
      <div className="space-y-6 fade-in">
        <div className={`bg-gradient-to-br ${isPerfect ? "from-emerald-600 via-teal-500 to-green-600" : isGood ? "from-indigo-600 to-purple-600" : isFair ? "from-amber-600 to-orange-600" : "from-red-600 to-pink-600"} rounded-3xl p-8 text-white shadow-xl`}>
          <p className="text-sm opacity-90 mb-2 font-semibold uppercase tracking-wide">🎉 Quiz Complete</p>
          <h2 className="text-4xl font-bold mb-6">{data.title}</h2>
          
          <div className="bg-white/10 backdrop-blur rounded-2xl p-6 mb-4">
            <p className="text-white/80 text-sm mb-1">Your Score</p>
            <p className="text-5xl font-black mb-2">
              {result.score} <span className="text-4xl opacity-75">/ {result.total}</span>
            </p>
            <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-2xl font-bold">
              {pct}%
              <span className="text-xl ml-2 opacity-80">
                {isPerfect ? "Perfect! 🌟" : isGood ? "Excellent! 🎯" : isFair ? "Good! 👍" : "Keep Practicing! 💪"}
              </span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900">Review Your Answers</h3>
          {result.review.map((q, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border-2 p-5 shadow-sm transition-all ${
                q.correct
                  ? "border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50"
                  : "border-red-200 bg-gradient-to-r from-red-50 to-pink-50"
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <span
                  className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                    q.correct
                      ? "bg-gradient-to-r from-emerald-600 to-green-600"
                      : "bg-gradient-to-r from-red-600 to-pink-600"
                  }`}
                >
                  {q.correct ? "✓" : "✕"}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-500 mb-1">Question {i + 1}</p>
                  <h4 className="font-semibold text-gray-900 text-base">{q.question}</h4>
                </div>
              </div>
              <div className="space-y-2 ml-11">
                {q.options.map((opt, oi) => {
                  const isCorrect = oi === q.correctAnswer;
                  const isUser = oi === q.userAnswer;
                  return (
                    <div
                      key={oi}
                      className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        isCorrect
                          ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                          : isUser
                          ? "border-red-400 bg-red-100 text-red-900"
                          : "border-gray-200 bg-white text-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {isCorrect && <span className="text-lg">✓ Correct</span>}
                        {isUser && !isCorrect && <span className="text-lg">✕ Your Answer</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <Button onClick={() => navigate(`/opportunities/${opportunityId}`)} variant="secondary">
            ← Back to Opportunity
          </Button>
          <Button variant="success" onClick={() => window.location.reload()}>
            🔄 Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  const answered = answers.filter((a) => a !== -1).length;

  return (
    <div className="space-y-6 fade-in">
      <Link
        to={`/opportunities/${opportunityId}`}
        className="text-sm text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 font-semibold"
      >
        ← Back to Opportunity
      </Link>

      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-xl">
        <p className="text-sm opacity-90 mb-2 font-semibold uppercase tracking-wide">📝 Practice Quiz</p>
        <h2 className="text-4xl font-bold mb-4">{data.title}</h2>
        
        <div className="bg-white/10 backdrop-blur rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white/80 font-medium text-sm">Progress: {answered} of {data.quiz.length} answered</p>
            <span className="text-white font-bold text-lg">{Math.round((answered / data.quiz.length) * 100)}%</span>
          </div>
          <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-white to-emerald-300 transition-all duration-300"
              style={{ width: `${(answered / data.quiz.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {data.quiz.map((q, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg p-6 shadow-sm transition-all duration-200"
          >
            <div className="flex items-start gap-4 mb-5">
              <span className="shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center text-sm font-bold">
                {i + 1}
              </span>
              <h3 className="font-bold text-gray-900 text-lg mt-1">{q.question}</h3>
            </div>
            <div className="space-y-3 ml-14">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    answers[i] === oi
                      ? "border-indigo-600 bg-gradient-to-r from-indigo-50 to-purple-50 shadow-md"
                      : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${i}`}
                    checked={answers[i] === oi}
                    onChange={() => handleSelect(i, oi)}
                    className="accent-indigo-600 w-5 h-5 cursor-pointer"
                  />
                  <span className="text-base text-gray-800 font-medium flex-1">{opt}</span>
                  {answers[i] === oi && (
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 p-6 -mx-6 md:-mx-8 flex items-center justify-between shadow-2xl">
        <span className="text-base font-semibold text-gray-700">
          <span className="text-indigo-600 font-bold">{answered}</span> of <span className="text-indigo-600 font-bold">{data.quiz.length}</span> answered
        </span>
        <Button
          onClick={handleSubmit}
          disabled={submitting || answered === 0}
          variant="success"
        >
          {submitting ? "Submitting..." : `✓ Submit Quiz (${answered}/${data.quiz.length})`}
        </Button>
      </div>
    </div>
  );
}
