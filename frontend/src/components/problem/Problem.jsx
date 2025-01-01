import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import Chip from "@mui/material/Chip";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BACK_SERVER_URL } from "../../config/config";
import CodeEditor from "./codeEditor/CodeEditor";
import "./problem.css";

const Problem = () => {
  const [loading, setLoading] = useState(true);
  const [problemDoesNotExists, setProblemDoesNotExists] = useState(false);
  const [problem, setProblem] = useState({});
  const [language, setLanguage] = useState("Javascript");
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  const [result, setResult] = useState({});
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [badgeColor, setBadgeColor] = useState("#D9D9D9");
  const [teacherProblemDetails, setTeacherProblemDetails] = useState({});

  const { id } = useParams();

  const languageExtension = {
    Javascript: "javascript",
    "C++": "cpp",
    Java: "java",
    Python: "py",
  };

  useEffect(() => {
    if (!id) {
      setProblemDoesNotExists(true);
      setLoading(false);
      return;
    }
    const role = localStorage.getItem("role") || "guest";
    let apiUrl =
      role === "student"
        ? `${BACK_SERVER_URL}/api/student/questions/${id}`
        : `${BACK_SERVER_URL}/api/teacher/questions/${id}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((res) => {
        if (!res.data || Object.keys(res.data).length === 0) {
          setProblemDoesNotExists(true);
        } else {
          setProblem(res.data);
          if (role === "teacher") {
            setTeacherProblemDetails(res.data);
          }
          // Set badge color based on difficulty
          const normalizedValue = res.data.difficulty?.toLowerCase();
          switch (normalizedValue) {
            case "easy":
              setBadgeColor("#8ACB88");
              break;
            case "hard":
              setBadgeColor("#FA7272");
              break;
            case "medium":
              setBadgeColor("#5AB2FF");
              break;
            default:
              setBadgeColor("#D9D9D9");
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setProblemDoesNotExists(true);
        const error =
          err.response?.data?.message ||
          "An unexpected error occurred. Please try again later.";
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
        });
      });
  }, [id]);
  const handleLanguageSelect = (e) => {
    setLanguage(e.target.value);
  };

  const handleModeChange = (themeMode) => {
    setDarkMode(themeMode);
  };

  const handleCodeChange = (newValue) => {
    setCode(newValue);
  };

  const handleSubmit = async () => {
    const accessToken = localStorage.getItem("access-token");
    if (!accessToken) {
      toast.error("Access token is missing. Please log in again.");
      return;
    }

    setSubmitLoading(true);

    try {
      const response = await axios.post(
        `${BACK_SERVER_URL}/student/submissions`,
        {
          questionID: id,
          language: languageExtension[language],
          code: code,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      // 如果是成功的回應
      if (response.data.status === "success") {
        const output = response.data.output;
        setResult({
          success: true,
          output: output.test_cases.map((test) => ({
            caseId: test.case_id,
            status: test.status,
            executionTime: test.execution_time,
            memoryUsed: test.memory_used,
            input: test.input,
            expectedOutput: test.expected_output,
            actualOutput: test.actual_output,
          })),
          totalTestCases: output.total_test_cases,
          passedTestCases: output.passed_test_cases,
          score: output.score,
          cpuUsage: output.cpu_usage,
          memoryUsage: output.memory_usage,
          executionTime: output.execution_time,
        });
      }
      // 如果是錯誤的回應
      else if (response.data.status === "error") {
        const errorDetails = response.data.errorRes.error;
        setResult({
          success: false,
          error: {
            code: errorDetails.code,
            message: errorDetails.message,
            line: errorDetails.details?.line,
            errorMessage: errorDetails.details?.error_message,
          },
          output: [],
          totalTestCases: 0,
          passedTestCases: 0,
          score: 0,
          executionTime: 0,
        });

        toast.error(errorDetails.message);
      }
    } catch (err) {
      console.error("Submission error:", err);
      const error = err.response?.data?.message || err.message;

      setResult({
        success: false,
        error: {
          code: "UNKNOWN_ERROR",
          message: error,
          errorMessage: "An unexpected error occurred",
        },
        output: [],
        totalTestCases: 0,
        passedTestCases: 0,
        score: 0,
        executionTime: 0,
      });

      toast.error(error);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRun = () => {
    setRunLoading(true);
    // Implement run logic here
    setRunLoading(false);
  };

  if (problemDoesNotExists) return <Navigate to="/nocontent" />;
  if (loading)
    return (
      <div className="problem-loading-spinner">
        <BeatLoader color={"#7D99D3"} size={20} loading={loading} />
      </div>
    );

  return (
    <div>
      <ToastContainer />
      <div style={{ display: "flex", height: "92.5vh" }}>
        <div className="problem-page-left">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              padding: "20px 0",
            }}
          >
            <h2 style={{ margin: 0 }}>{problem.name}</h2>
            <Chip
              label={problem.difficulty}
              style={{
                fontWeight: "bold",
                color: "white",
                backgroundColor: badgeColor,
                textTransform: "capitalize",
                height: "30px",
              }}
            />
          </div>
          <div className="problem-container">
            <div className="section-title">Description</div>
            <div>{problem.description}</div>
            <br />
            {problem.sample_test_cases &&
              problem.sample_test_cases.map((testcase, index) => (
                <React.Fragment key={index}>
                  <div className="section-title">Sample {index + 1}</div>
                  <div className="sample-block">
                    <div className="sample-line">
                      <span className="sample-label">Input:</span>
                      <span className="monospace">{testcase.input}</span>
                    </div>
                    <div className="sample-line">
                      <span className="sample-label">Output:</span>
                      <span className="monospace">
                        {testcase.expected_output}
                      </span>
                    </div>
                    <div className="sample-line">
                      <span className="sample-label">Explanation:</span>
                      <span>{testcase.explanation}</span>
                    </div>
                  </div>
                </React.Fragment>
              ))}

            <div className="section-title">Limit</div>
            <div className="sample-block">
              <div className="sample-line">
                <span className="sample-label">Time:</span>
                <span className="monospace">{problem.time_limit} second</span>
              </div>
              <div className="sample-line">
                <span className="sample-label">Memory:</span>
                <span className="monospace">{problem.memory_limit} MB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="problem-page-right">
          {localStorage.getItem("role") === "teacher" &&
          teacherProblemDetails ? (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "20px 0",
                }}
              >
                <h2 style={{ margin: 0 }}> Student Performance Overview</h2>
              </div>
              <div className="problem-container">
                <div className="section-title">
                  Number of Students Completed
                </div>

                <div>{teacherProblemDetails.finish_num}</div>
                <div className="section-title">Number of Correct Answers</div>

                <div>{teacherProblemDetails.AC_num}</div>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  padding: "20px 0",
                }}
              >
                <h2 style={{ margin: 0 }}>Code</h2>
                <h2 style={{ margin: 0, color: "#8ACB88" }}>{"</>"}</h2>
              </div>
              <div className="problem-container">
                <div className="code-editor">
                  <CodeEditor
                    language={language}
                    handleLanguageSelect={handleLanguageSelect}
                    darkMode={darkMode}
                    handleModeChange={handleModeChange}
                    onCodeChange={handleCodeChange}
                    submit={handleSubmit}
                    run={handleRun}
                    runLoading={runLoading}
                    submitLoading={submitLoading}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "20px 0",
                }}
              >
                <h2 style={{ margin: 0 }}>Result</h2>
                <h2
                  style={{ display: "flex", alignItems: "center", margin: 0 }}
                >
                  {result.success !== undefined &&
                    (result.success ? (
                      <CheckCircleTwoToneIcon
                        sx={{
                          fontSize: "30px",
                          borderRadius: "50%",
                          display: "inline-block",
                          padding: "0px",
                          boxSizing: "border-box",
                          "& path:first-of-type": {
                            color: "#f8f8f8",
                          },
                          "& path:last-child": {
                            color: "#36B408",
                          },
                        }}
                      />
                    ) : (
                      <CancelTwoToneIcon
                        sx={{
                          fontSize: "30px",
                          borderRadius: "50%",
                          display: "inline-block",
                          padding: "0px",
                          boxSizing: "border-box",
                          "& path:first-of-type": {
                            color: "#f8f8f8",
                          },
                          "& path:last-child": {
                            color: "#FF0000",
                          },
                        }}
                      />
                    ))}
                </h2>
              </div>
              {/* result */}
              <div className="problem-container">
                {result.success !== undefined && (
                  <div className="result">
                    {result.error ? (
                      <div className="sample-block">
                        <div className="sample-line">
                          <span className="sample-label">Error Code:</span>
                          <span
                            className="monospace"
                            style={{
                              color: "#FF0000",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              overflow: "auto",
                              maxWidth: "100%",
                            }}
                          >
                            {result.error.code}
                          </span>
                        </div>
                        <div className="sample-line">
                          <span className="sample-label">Error Message:</span>
                          <span
                            className="monospace"
                            style={{
                              color: "#FF0000",
                              wordBreak: "break-word",
                              whiteSpace: "pre-wrap",
                              overflow: "auto",
                              maxWidth: "100%",
                            }}
                          >
                            {result.error.message}
                          </span>
                        </div>
                        {result.error.line && (
                          <div className="sample-line">
                            <span className="sample-label">Error Line:</span>
                            <span
                              className="monospace"
                              style={{
                                color: "#FF0000",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                                overflow: "auto",
                                maxWidth: "100%",
                              }}
                            >
                              {result.error.line}
                            </span>
                          </div>
                        )}
                        {result.error.errorMessage && (
                          <div className="sample-line">
                            <span className="sample-label">Details:</span>
                            <span
                              className="monospace"
                              style={{
                                color: "#FF0000",
                                wordBreak: "break-word",
                                whiteSpace: "pre-wrap",
                                overflow: "auto",
                                maxWidth: "100%",
                              }}
                            >
                              {result.error.errorMessage}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <>
                        <div className="section-title custom-color">
                          Summary
                        </div>
                        <div className="sample-block">
                          <div className="sample-line">
                            <span className="sample-label">
                              Total Test Cases:
                            </span>
                            <span className="monospace">
                              {result.totalTestCases}
                            </span>
                          </div>
                          <div className="sample-line">
                            <span className="sample-label">
                              Passed Test Cases:
                            </span>
                            <span className="monospace">
                              {result.passedTestCases}
                            </span>
                          </div>
                          <div className="sample-line">
                            <span className="sample-label">Score:</span>
                            <span className="monospace">{result.score}</span>
                          </div>
                          <div className="sample-line">
                            <span className="sample-label">CPU Usage:</span>
                            <span className="monospace">{result.cpuUsage}</span>
                          </div>
                          <div className="sample-line">
                            <span className="sample-label">Memory Usage:</span>
                            <span className="monospace">
                              {result.memoryUsage}
                            </span>
                          </div>
                          <div className="sample-line">
                            <span className="sample-label">
                              Execution Time:
                            </span>
                            <span className="monospace">
                              {result.executionTime}ms
                            </span>
                          </div>
                        </div>

                        {result.output &&
                          result.output.map((test) => (
                            <React.Fragment key={test.caseId}>
                              <div className="section-title custom-color">
                                Test Case {test.caseId}
                              </div>
                              <div className="sample-block">
                                <div className="sample-line">
                                  <span className="sample-label">Status:</span>
                                  <span className="monospace">
                                    {test.status}
                                  </span>
                                </div>
                                <div className="sample-line">
                                  <span className="sample-label">
                                    Execution Time:
                                  </span>
                                  <span className="monospace">
                                    {test.executionTime}ms
                                  </span>
                                </div>
                                <div className="sample-line">
                                  <span className="sample-label">
                                    Memory Used:
                                  </span>
                                  <span className="monospace">
                                    {test.memoryUsed}KB
                                  </span>
                                </div>
                                <div className="sample-line">
                                  <span className="sample-label">Input:</span>
                                  <span className="monospace">
                                    {test.input}
                                  </span>
                                </div>
                                <div className="sample-line">
                                  <span className="sample-label">
                                    Expected Output:
                                  </span>
                                  <span className="monospace">
                                    {test.expectedOutput}
                                  </span>
                                </div>
                                <div className="sample-line">
                                  <span className="sample-label">
                                    Actual Output:
                                  </span>
                                  <span className="monospace">
                                    {test.actualOutput}
                                  </span>
                                </div>
                              </div>
                            </React.Fragment>
                          ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problem;
