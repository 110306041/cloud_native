import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import Chip from "@mui/material/Chip";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BACK_SERVER_URL, JUDGE_URL } from "../../config/config";

import CodeEditor from "./codeEditor/CodeEditor";

import { resultFake } from "../../utils";
import "./problem.css";

const Problem = (props) => {
  const resultRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [problemDoesNotExists, setProblemDoesNotExists] = useState(false);
  const [problem, setProblem] = useState({});
  const [language, setLanguage] = useState("Javascript");
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  //   const [results, setResults] = useState([]);
  const [result, setResult] = useState(resultFake); //{}
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [badgeColor, setBadgeColor] = useState("#D9D9D9"); // 預設灰色
  const [teacherProblemDetails, setTeacherProblemDetails] = useState({});
  const { id } = useParams();

  const languageExtention = {
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

          // For teacher-specific API response
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
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "An unexpected error occurred. Please try again later.";
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  }, [id]);

  const handleLanguageSelect = (e) => {
    e.preventDefault();
    setLanguage(e.target.value);
  };

  const handleModeChange = (themeMode) => {
    setDarkMode(themeMode);
  };

  const onCodeChange = (newValue) => {
    setCode(newValue);
  };

  const parseJwt = (token) => {
    if (token === "" || token === null) return null;
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace("-", "+").replace("_", "/");
    return JSON.parse(window.atob(base64)).sub;
  };

  const submit = (e) => {
    e.preventDefault();
    const operation = e.currentTarget.value.toString();
    if (operation === "runcode") setRunLoading(true);
    else setSubmitLoading(true);

    const accessToken = localStorage.getItem("access-token");
    const userId = parseJwt(accessToken);

    axios
      .post(
        `${JUDGE_URL}/api/evaluate`,
        {
          problemId: problem.id,
          problemName: problem.name,
          code: code,
          language: languageExtention[language],
          operation: operation,
        },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      .then((res) => {
        if (operation === "runcode") setRunLoading(false);
        else {
          setRunLoading(false);
          setSubmitLoading(false);
          axios
            .post(
              `${BACK_SERVER_URL}/api/submission`,
              {
                problemName: problem.name,
                code,
                language: languageExtention[language],
                userId,
                verdict: res.data.verdict,
                result: res.data.result,
              },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            )
            .then(() => {})
            .catch((err) => {
              const error = err.response
                ? err.response.data.message
                : err.message;
              toast.error(error, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
            });
        }
        // setResults(res.data.result);
        setResult(res.data.result);

        if (resultRef.current) {
          resultRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "start",
          });
        }
      })
      .catch((err) => {
        setRunLoading(false);
        setSubmitLoading(false);
        const error = err.response ? err.response.data.message : err.message;
        toast.error(error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      });
  };

  return problemDoesNotExists ? (
    <>
      <Navigate to="/nocontent" />
    </>
  ) : loading ? (
    <div className="problem-loading-spinner">
      <BeatLoader color={"#343a40"} size={30} loading={loading} />
    </div>
  ) : (
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
              problem.sample_test_cases.map((testcase, index) => {
                return (
                  <>
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
                  </>
                );
              })}
            <div className="section-title">Constraints</div>
            <li>{problem.constraints}</li>
            <div className="sample-line">
              <span className="section-title">Time Limit </span>
            </div>
            <span
              style={{
                fontWeight: "normal", // 正常字體粗細
                fontFamily: "monospace", // 等寬字體
                fontSize: "16px", // 可選：調整字體大小
                marginLeft: "8px", // 增加與前置標籤的間距
              }}
            >
              {problem.time_limit} second
            </span>
            <div className="sample-line">
              <span className="section-title">Memory Limit </span>
            </div>{" "}
            <span
              style={{
                fontWeight: "normal", // 正常字體粗細
                fontFamily: "monospace", // 等寬字體
                fontSize: "16px", // 可選：調整字體大小
                marginLeft: "8px", // 增加與前置標籤的間距
              }}
            >
              {problem.memory_limit} MB
            </span>
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
                    onCodeChange={onCodeChange}
                    submit={submit}
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
                  {result.success ? (
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
                  )}
                </h2>
              </div>
              <div className="problem-container">
                <div className="result-table">
                  <div className="result-line">
                    <span className="result-label">Output:</span>
                    <span className="result-value">{result.output}</span>
                  </div>
                  <div className="result-line">
                    <span className="result-label">Cpu Usage:</span>
                    <span className="result-value">{result.cpuUsage}</span>
                  </div>
                  <div className="result-line">
                    <span className="result-label">Memory Usage:</span>
                    <span className="result-value">{result.memoryUsage}</span>
                  </div>
                  <div className="result-line">
                    <span className="result-label">Execution Time:</span>
                    <span className="result-value">{result.executionTime}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Problem;
