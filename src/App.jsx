import { useState } from "react";
import ReactMarkdown from "react-markdown";

function App() {
  const [goal, setGoal] = useState("");
  const [time, setTime] = useState("");
  const [equipment, setEquipment] = useState([]);
  const [experience, setExperience] = useState("beginner");
  const [workoutPlan, setWorkoutPlan] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [injuries, setInjuries] = useState("");
  const [daysPerWeek, setDaysPerWeek] = useState("");

  const options = [
    "Gym",
    "Dumbbells",
    "Barbell",
    "Resistance Bands",
    "Pull-up Bar",
    "Kettlebell",
    "Bodyweight Only",
  ];

  function handleEquipmentChange(value) {
    setEquipment((prev) =>
      prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value],
    );
  }

  async function generateWorkout() {
    if (!goal || !time || equipment.length === 0 || !experience || !daysPerWeek)
      return;
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(
        "https://workout-coach-backend.onrender.com",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            goal,
            time,
            equipment: equipment.join(", "),
            experience,
            daysPerWeek,
            injuries,
          }),
        },
      );
      const data = await response.json();
      setWorkoutPlan(data.workoutPlan);
    } catch {
      setError("Something went wrong — please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-tag">AI-Powered</div>
        <h1>Workout Coach</h1>
        <p className="header-sub">
          Answer a few questions and get a personalised plan in seconds.
        </p>
      </header>

      {/* Form */}
      <div className="form-card">
        <div className="form-section">
          <span className="section-num">01</span>
          <div className="section-body">
            <label>What is your goal?</label>
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g. build muscle, lose fat, improve endurance"
            />
          </div>
        </div>

        <div className="form-section">
          <span className="section-num">02</span>
          <div className="section-body">
            <label>Time per session</label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="e.g. 45 minutes"
            />
          </div>
        </div>

        <div className="form-section">
          <span className="section-num">03</span>
          <div className="section-body">
            <label>Days per week</label>
            <input
              type="number"
              value={daysPerWeek}
              onChange={(e) => setDaysPerWeek(e.target.value)}
              min={1}
              max={7}
              placeholder="e.g. 3"
            />
          </div>
        </div>

        <div className="form-section">
          <span className="section-num">04</span>
          <div className="section-body">
            <label>Experience level</label>
            <div className="pill-group">
              {["beginner", "intermediate", "advanced"].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`pill ${experience === level ? "pill-active" : ""}`}
                  onClick={() => setExperience(level)}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <span className="section-num">05</span>
          <div className="section-body">
            <label>Available equipment</label>
            <div className="chip-group">
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`chip ${equipment.includes(option) ? "chip-active" : ""}`}
                  onClick={() => handleEquipmentChange(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="form-section">
          <span className="section-num">06</span>
          <div className="section-body">
            <label>
              Injuries or limitations <span className="optional">optional</span>
            </label>
            <input
              type="text"
              value={injuries}
              onChange={(e) => setInjuries(e.target.value)}
              placeholder="e.g. bad knees, lower back pain"
            />
          </div>
        </div>

        <div className="form-footer">
          <button
            className="generate-btn"
            onClick={generateWorkout}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-text">
                <span className="spinner" />
                Generating your plan...
              </span>
            ) : (
              "Generate My Plan"
            )}
          </button>
          {error && <p className="error-msg">{error}</p>}
        </div>
      </div>

      {/* Output */}
      {workoutPlan && (
        <div className="plan-card">
          <div className="plan-header">
            <div>
              <p className="plan-eyebrow">Ready</p>
              <h2>Your Workout Plan</h2>
            </div>
            <div className="plan-actions">
              <button
                className="action-btn"
                onClick={generateWorkout}
                disabled={isLoading}
              >
                Regenerate
              </button>
              <button className="action-btn" onClick={() => window.print()}>
                Save PDF
              </button>
            </div>
          </div>
          <div className="markdown">
            <ReactMarkdown>{workoutPlan}</ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
