import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIncon from "@mui/icons-material/HighlightOff";

import { BACK_SERVER_URL, JUDGE_URL } from "../../config/config";

import CodeEditor from "./codeEditor/CodeEditor";

import { problemFake, resultFake } from "../../utils";
import "./problem.css";

const Problem = (props) => {
  const resultRef = useRef(null);
  const [loading, setLoading] = useState(false); // true
  const [problemDoesNotExists, setProblemDoesNotExists] = useState(false);
  const [problem, setProblem] = useState(problemFake); //{}
  const [language, setLanguage] = useState("C++");
  const [darkMode, setDarkMode] = useState(false);
  const [code, setCode] = useState("");
  //   const [results, setResults] = useState([]);
  const [result, setResult] = useState(resultFake); //{}
  const [runLoading, setRunLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const problemId = useParams();

  const languageExtention = {
    C: "c",
    "C++": "cpp",
    Java: "java",
    Python: "py",
  };

  useEffect(() => {
    // const problemId = props.match.params.id;

    axios
      .get(`${BACK_SERVER_URL}/api/problem/${problemId}`)
      .then((res) => {
        if (!res.data || res.data.length === 0) setProblemDoesNotExists(true);
        else {
          setProblem(res.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        // setLoading(false);
        // setProblemDoesNotExists(true);
        const error = err.response ? err.response.data.message : err.message;
        // toast.error(error, {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
      });

    return () => {};
  }, [problemId]);

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
              //   toast.error(error, {
              //     position: "top-right",
              //     autoClose: 5000,
              //     hideProgressBar: false,
              //     closeOnClick: true,
              //     pauseOnHover: true,
              //     draggable: true,
              //     progress: undefined,
              //   });
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
        // toast.error(error, {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
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
      {/* <ToastContainer /> */}
      <div style={{ display: "flex", height: "92.5vh" }}>
        <div className="problem-page-left">
          <h2>{problem.name}</h2>
          <h3>Description</h3>
          <div>{problem.description}</div>
          <br />
          <h3>Samples</h3>
          {problem.sampleTestcases &&
            problem.sampleTestcases.map((testcase, index) => {
              return (
                <>
                  <div style={{ fontWeight: "bold" }}>Sample {index + 1}</div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Input: </span>
                    <span>{testcase.input}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Output: </span>
                    <span>{testcase.output}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 600 }}>Explanation: </span>
                    <span>{testcase.explanation}</span>
                  </div>
                  <br />
                </>
              );
            })}
          <h3>Constraints</h3>
          <div>{problem.constraints}</div>
        </div>
        <div className="problem-page-right">
          <div className="problem-page-right-container">
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
            <div className="result-table">
              <h2>
                Result
                {result.success ? (
                  <CheckCircleIcon className="result-accepted-icon" />
                ) : (
                  <CancelIncon className="result-error-icon" />
                )}
              </h2>
              <div>
                <span style={{ fontWeight: 600 }}>Output: </span>
                <span>{result.output}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Cpu Usage: </span>
                <span>{result.cpuUsage}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Memory Usage: </span>
                <span>{result.memoryUsage}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600 }}>Execution Time: </span>
                <span>{result.executionTime}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Problem;
