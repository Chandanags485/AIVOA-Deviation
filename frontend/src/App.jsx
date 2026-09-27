import { useDispatch, useSelector } from "react-redux";
import {
  updateField,
  setSourceText,
  setForm,
  setLoading,
  setError,
} from "./store/deviationSlice";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  const { form, sourceText, loading, error } = useSelector(
    (state) => state.deviation,
  );

  const handleChange = (field, value) => {
    dispatch(
      updateField({
        field,
        value,
      }),
    );
  };

  const analyzeText = async () => {
    if (!sourceText.trim()) {
      dispatch(setError("Please enter deviation text first."));
      return;
    }

    dispatch(setError(""));
    dispatch(setLoading(true));

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/deviations/analyze-text",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: sourceText,
          }),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Analysis failed");
      }

      dispatch(
        setForm({
          ...result.data.extracted,
          severity: result.data.risk.severity,
          severity_reason: result.data.risk.severity_reason,
        }),
      );
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handlePdfUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      dispatch(setError("Please upload a PDF file."));
      return;
    }

    dispatch(setError(""));
    dispatch(setLoading(true));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/deviations/analyze-pdf",
        {
          method: "POST",
          body: formData,
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "PDF analysis failed");
      }

      dispatch(setSourceText(result.extracted_text));

      dispatch(
        setForm({
          ...result.data.extracted,
          severity: result.data.risk.severity,
          severity_reason: result.data.risk.severity_reason,
        }),
      );
    } catch (err) {
      dispatch(setError(err.message));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const saveDeviation = async () => {
    dispatch(setError(""));

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/deviations/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        },
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || "Save failed");
      }

      alert(`Deviation saved successfully. ID: ${result.id}`);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>AIVOA Quality Management</h1>
          <p>AI-Powered Deviation Intake</p>
        </div>

        <div className="status">● System Online</div>
      </header>

      <main className="container">
        <div className="page-title">
          <h2>Log Deviation</h2>
          <p>
            Use AI to extract deviation information and assist with initial
            impact and severity assessment.
          </p>
        </div>

        {error && <div className="error">{error}</div>}

        <div className="workspace">
          {/* LEFT SIDE */}

          <section className="card">
            <div className="card-header">
              <div>
                <h3>Deviation Details</h3>
                <p>Review and edit the AI-generated information.</p>
              </div>
            </div>

            <div className="input-section">
              <label>Paste Deviation Text</label>

              <textarea
                value={sourceText}
                onChange={(e) => dispatch(setSourceText(e.target.value))}
                placeholder="Paste deviation report or email content here..."
                rows="7"
              />

              <div className="actions">
                <button
                  className="primary"
                  onClick={analyzeText}
                  disabled={loading}
                >
                  {loading ? "Analyzing..." : "Analyze with AI"}
                </button>

                <label className="upload-button">
                  Upload PDF
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    hidden
                  />
                </label>
              </div>
            </div>

            <div className="form-grid">
              <div className="field full">
                <label>Deviation Title</label>
                <input
                  value={form.deviation_title}
                  onChange={(e) =>
                    handleChange("deviation_title", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>Batch Number</label>
                <input
                  value={form.batch_number}
                  onChange={(e) => handleChange("batch_number", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Process Step</label>
                <input
                  value={form.process_step}
                  onChange={(e) => handleChange("process_step", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Parameter</label>
                <input
                  value={form.parameter}
                  onChange={(e) => handleChange("parameter", e.target.value)}
                />
              </div>

              <div className="field">
                <label>Observed Value</label>
                <input
                  value={form.observed_value}
                  onChange={(e) =>
                    handleChange("observed_value", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>Approved Range</label>
                <input
                  value={form.approved_range}
                  onChange={(e) =>
                    handleChange("approved_range", e.target.value)
                  }
                />
              </div>

              <div className="field">
                <label>Duration</label>
                <input
                  value={form.duration}
                  onChange={(e) => handleChange("duration", e.target.value)}
                />
              </div>

              <div className="field full">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  rows="4"
                />
              </div>

              <div className="field full">
                <label>Potential Impact</label>
                <textarea
                  value={form.potential_impact}
                  onChange={(e) =>
                    handleChange("potential_impact", e.target.value)
                  }
                  rows="4"
                />
              </div>
            </div>

            <div className="save-area">
              <button className="save-button" onClick={saveDeviation}>
                Save Deviation
              </button>
            </div>
          </section>

          {/* RIGHT SIDE */}

          <aside className="card copilot">
            <div className="copilot-header">
              <div className="ai-icon">AI</div>

              <div>
                <h3>AI Copilot</h3>
                <p>Impact & Severity Assessment</p>
              </div>
            </div>

            <div className="risk-box">
              <span className="risk-label">
                Initial Severity Recommendation
              </span>

              <div className="severity">{form.severity || "Not assessed"}</div>

              <p>
                {form.severity_reason ||
                  "Analyze a deviation to receive an AI-assisted severity recommendation."}
              </p>
            </div>

            <div className="copilot-note">
              <strong>Review required</strong>

              <p>
                The AI recommendation is an initial assessment. Quality
                personnel should review the information and make the final
                decision before saving.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
