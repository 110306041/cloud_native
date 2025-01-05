import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Send } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  ThemeProvider,
  Typography,
  createTheme,
} from "@mui/material";
import axios from "axios";
import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../../config/config";
import "./addProblem.css";

// --------- Theme 設定 ---------
const theme = createTheme({
  palette: {
    primary: {
      main: "#445E93",
    },
    secondary: {
      main: "#445E93",
    },
  },
  typography: {
    h4: {
      fontSize: "24px",
      fontWeight: 600,
    },
    body1: {
      fontSize: "14px",
    },
    body2: {
      fontSize: "14px",
    },
    subtitle1: {
      fontSize: "16px",
      fontWeight: 500,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          marginTop: "36px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontSize: "14px",
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontSize: "14px",
          },
          "& .MuiInputLabel-root": {
            fontSize: "14px",
          },
          "& .MuiInputBase-input": {
            fontSize: "14px",
          },
        },
      },
    },
  },
});

const problemDifficulty = ["easy", "medium", "hard"];

// --------- 主元件 AddProblem ---------
const AddProblem = () => {
  const [questionName, setQuestionName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeLimit, setTimeLimit] = useState();
  const [memoryLimit, setMemoryLimit] = useState();
  const [submissionLimit, setSubmissionLimit] = useState();
  const [dueDate, setDueDate] = useState(""); // TODO: discard dueDate
  const [description, setDescription] = useState("");

  // 用來管理 sample testcases 的 input/output
  const [input, setInput] = useState([""]);
  const [output, setOutput] = useState([""]);
  const [testcaseCount, setTestcaseCount] = useState(1);

  // loading 狀態
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const id = location.state?.id;
  const problemType = location.state?.problemtype;
  // --------- 新增一筆 sample testcase ---------
  const addTestcase = () => {
    setInput([...input, ""]);
    setOutput([...output, ""]);
    setTestcaseCount(testcaseCount + 1);
  };

  // --------- 刪除最後一筆 sample testcase ---------
  const handleDelete = () => {
    if (testcaseCount > 0) {
      const newInput = [...input];
      const newOutput = [...output];
      newInput.pop();
      newOutput.pop();
      setInput(newInput);
      setOutput(newOutput);
      setTestcaseCount(testcaseCount - 1);
    }
  };
  // --------- 送出表單 ---------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let data = {};

    // 把 input / output 資料組合為 sampleTestcases 陣列
    let sampleTestcases = [];
    for (let i = 0; i < input.length; i++) {
      sampleTestcases.push({
        input: input[i],
        expected_output: output[i],
      });
    }

    // 決定傳給後端的 data 結構
    if (problemType === "assignments") {
      data = {
        assignment_id: id,
        difficulty: difficulty,
        time_limit: timeLimit,
        memory_limit: memoryLimit,
        submission_limit: submissionLimit,
        due_date: dueDate,
        description: description,
        test_cases: sampleTestcases,
        question_name: questionName,
      };
    } else {
      data = {
        exam_id: id,
        difficulty: difficulty,
        time_limit: timeLimit,
        memory_limit: memoryLimit,
        submission_limit: submissionLimit,
        due_date: dueDate,
        description: description,
        test_cases: sampleTestcases,
        question_name: questionName,
      };
    }

    try {
      console.log("Req:", data);
      await axios.post(`${BACK_SERVER_URL}/teacher/questions`, data, {
        headers: {
          Authorization: `Bear ${localStorage.getItem("access-token")}`,
        },
      });

      toast.success("Course Created Successfully", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      navigate(-1);
    } catch (err) {
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
    } finally {
      setLoading(false);
    }
  };

  // 確認每個 text field 都有資訊
  const isFormValid = useMemo(() => {
    const hasBasicFields =
      questionName.trim() !== "" &&
      difficulty !== "" &&
      timeLimit &&
      memoryLimit &&
      submissionLimit &&
      description.trim() !== "";

    const hasValidTestcases =
      input.every((i) => i.trim() !== "") &&
      output.every((o) => o.trim() !== "");

    return hasBasicFields && hasValidTestcases;
  }, [
    questionName,
    difficulty,
    timeLimit,
    memoryLimit,
    submissionLimit,
    description,
    input,
    output,
  ]);
  // --------- 畫面呈現 ---------
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
        }}
      >
        <Container maxWidth="sm">
          <ToastContainer />
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <Box>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#445E93" }}
              >
                Add New Problem
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please fill in the problem information below
              </Typography>
            </Box>

            {/* 表單開始 */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <TextField
                label="Problem Name"
                value={questionName}
                onChange={(e) => setQuestionName(e.target.value)}
                placeholder="Enter problem name"
                fullWidth
                required
                variant="outlined"
              />
              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Assignment Description Here"
                fullWidth
                required
                variant="outlined"
                multiline
                rows={4}
              />
              {/* TODO: remove dueDate */}
              <TextField
                label="Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {/* 難度選擇 */}
              <select
                required
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(event) => setDifficulty(event.target.value)}
                style={{
                  width: "100%",
                  height: "55px",
                  fontSize: "15px",
                  marginBottom: "10px",
                  paddingLeft: "10px",
                  borderRadius: "5px",
                  border: "1px solid #445E93",
                  color: difficulty ? "#000000" : "#445E93",
                }}
              >
                <option value="" disabled style={{ color: "#445E93" }}>
                  Select Difficulty
                </option>
                {problemDifficulty.map((type, index) => {
                  return (
                    <option key={index} value={type.toLowerCase()}>
                      {type}
                    </option>
                  );
                })}
              </select>
              {/* Time / Memory / Submission Limit */}
              <div style={{ display: "flex", gap: 5 }}>
                <NumberField
                  label="Time Limit"
                  value={timeLimit}
                  setValue={setTimeLimit}
                  placeholder="Enter time limit (sec)"
                />
                <NumberField
                  label="Memory Limit"
                  value={memoryLimit}
                  setValue={setMemoryLimit}
                  placeholder="Enter memory limit (MB)"
                />
                <NumberField
                  label="Submission times"
                  value={submissionLimit}
                  setValue={setSubmissionLimit}
                  placeholder="Submission times limit"
                />
              </div>
              <h3 style={{ color: "#445E93", fontWeight: "bold" }}>
                Sample Testcase
              </h3>
              <TestcaseFormat />
              {testcaseCount > 0 && (
                <div>
                  {Array.from({ length: testcaseCount }).map((_, index) => (
                    <SampleTestcase
                      key={index}
                      i={index}
                      input={input}
                      setInput={setInput}
                      output={output}
                      setOutput={setOutput}
                    />
                  ))}
                </div>
              )}{" "}
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={addTestcase}
                  type="button"
                  startIcon={<FontAwesomeIcon icon={faPlus} />}
                  fullWidth
                  sx={{
                    height: 50,
                    backgroundColor: "#445E93",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#374B76",
                    },
                  }}
                >
                  Add Sample Testcase
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    height: 50,
                    backgroundColor: "#FA7272",
                    color: "#fff",
                    "&:hover": {
                      backgroundColor: "#E56666",
                    },
                    "&:disabled": {
                      backgroundColor: "#FFB6B6",
                    },
                  }}
                  onClick={handleDelete}
                  type="button"
                  disabled={testcaseCount <= 1}
                  startIcon={<FontAwesomeIcon icon={faTrash} />}
                >
                  Delete
                </Button>
              </Box>
              {/* 下方取消 / 送出按鈕 */}
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(-1)}
                  disabled={loading}
                  sx={{
                    height: 50,
                    borderColor: "#445E93",
                    color: "#445E93",
                    "&:hover": {
                      borderColor: "#445E93",
                      backgroundColor: "rgba(68, 94, 147, 0.04)",
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading || !isFormValid}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Send />
                  }
                  sx={{
                    height: 50,
                    "&:disabled": {
                      backgroundColor: "#B1B1B1",
                    },
                  }}
                >
                  {loading ? "Processing" : "Submit"}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AddProblem;

// --------- NumberField 子元件 ---------
export const NumberField = ({ label, value, setValue, placeholder }) => {
  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(e) => {
        const newVal = e.target.value;
        if (/^\d*$/.test(newVal)) {
          setValue(newVal);
        }
      }}
      placeholder={placeholder}
      fullWidth
      required
      variant="outlined"
      sx={{
        "& .MuiInputBase-input::placeholder": {
          fontSize: "10.5px",
        },
      }}
    />
  );
};

// --------- SampleTestcase 子元件 ---------
const SampleTestcase = ({ i, input, output, setInput, setOutput }) => {
  const handleInputChange = (e) => {
    const newInput = [...input];
    newInput[i] = e.target.value;
    setInput(newInput);
  };

  const handleOutputChange = (e) => {
    const newOutput = [...output];
    newOutput[i] = e.target.value;
    setOutput(newOutput);
  };

  return (
    <Box sx={{ mb: 1.5 }}>
      <Typography
        variant="subtitle1"
        sx={{ mb: 2, color: "primary.main", fontWeight: "bold" }}
      >
        Testcase {i + 1}
      </Typography>

      <TextField
        label="Sample Input"
        multiline
        rows={3}
        fullWidth
        value={input[i] || ""}
        onChange={handleInputChange}
        variant="outlined"
        sx={{ mb: 2, fontFamily: "monospace" }}
      />

      <TextField
        label="Sample Output"
        multiline
        rows={3}
        fullWidth
        value={output[i] || ""}
        onChange={handleOutputChange}
        variant="outlined"
        sx={{ fontFamily: "monospace" }}
      />
    </Box>
  );
};

const TestcaseFormat = () => {
  const formats = [
    { label: "Int", value: "5" },
    { label: "String", value: '"hello"' },
    { label: "Array", value: "[1,2]" },
    {
      label: "Object/JSON",
      value: '{ "name": "Alice", "age": 25},\n{ "name": "Bob", "age": 20}',
    },
    { label: "Multiple Inputs", value: '["python",2]' },
  ];

  return (
    <Box
      sx={{
        mb: -1,
        p: 2,
        backgroundColor: "#f8f9fa",
        borderRadius: 1,
        border: "1px solid #e9ecef",
      }}
    >
      <Typography
        variant="subtitle2"
        sx={{
          mb: 2,
          color: "#222222",
          fontWeight: "bold",
          fontSize: "0.875rem",
        }}
      >
        Testcase Format Guide
      </Typography>
      {formats.map((format, idx) => (
        <Box
          key={idx}
          sx={{
            display: "flex",
            alignItems: "center",
            mb: idx === formats.length - 1 ? 0 : 1.5, // 最後一行不添加 margin
          }}
        >
          <Typography
            variant="body2"
            sx={{ color: "text.primary", fontWeight: 500, flexShrink: 0 }}
          >
            {format.label}:
          </Typography>
          <Box
            sx={{
              ml: 2,
              p: 1,
              borderRadius: 1,
              fontFamily: "monospace",
              fontSize: "0.875rem",
              color: "#0d6efd",
              flexGrow: 1,
              overflowX: "auto",
            }}
          >
            {format.value}
          </Box>
        </Box>
      ))}
    </Box>
  );
};
