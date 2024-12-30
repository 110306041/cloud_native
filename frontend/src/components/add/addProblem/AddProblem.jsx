import {
    faPlus,
    faTrash
} from "@fortawesome/free-solid-svg-icons";
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
import React, { useState } from "react";
import { Form, Table } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../../config/config";
import "./addProblem.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#445E93",
    },
    secondary: {
      main: "#445E93",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

const problemDifficulty = ["easy", "medium", "hard"];

const AddProblem = () => {
  const [questionName, setQuestionName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [timeLimit, setTimeLimit] = useState();
  const [memoryLimit, setMemoryLimit] = useState();
  const [submissionLimit, setSubmissionLimit] = useState();
  const [dueDate, setDueDate] = useState(""); // TODO: discard dueDate
  const [description, setDescription] = useState("");
  const [testCases, setTestCases] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [input, setInput] = useState([]);
  const [output, setOutput] = useState([]);
  const [children, setChildren] = useState([]);

  const location = useLocation();
  const id = location.state?.id;
  const problemType = location.state?.problemType;

  const addTestcase = () => {
    setChildren(
      children.concat(
        <SampleTestcase
          key={children.length}
          i={children.length}
          input={input}
          setInput={setInput}
          output={output}
          setOutput={setOutput}
        />
      )
    );
  };

  const handleDelete = () => {
    let newChildren = children;
    newChildren.splice(-1);
    setChildren([...newChildren]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let data = {};

    let sampleTestcases = [];
    for (let i = 0; i < input.length; i++) {
      sampleTestcases.push({
        input: input[i],
        expected_output: output[i],
      });
    }

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
      await axios.post(`${BACK_SERVER_URL}/api/teacher/questions`, data, {
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

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          marginTop: "-10px", // 調整負的 margin 來上移
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

              <select
                required
                id="difficulty"
                name="difficulty"
                value={difficulty}
                onChange={(event) => {
                  setDifficulty(event.target.value);
                }}
                // fullWidth
                style={{
                  width: "100%",
                  height: "55px",
                  fontSize: "15px",
                  marginBottom: "10px",
                  paddingLeft: "10px",
                  borderRadius: "5px",
                  border: "1px solid #445E93",
                  color: difficulty ? "#000000" : "445E937", // 選擇完後變黑色
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
              
              <Form.Group>{children}</Form.Group>
              <Form.Group>
                <div style={{ display: "flex", gap: "15px" }}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{
                      color: "#fff",
                      width: "80%",
                    }}
                    size="large"
                    onClick={addTestcase}
                    type="button"
                  >
                    <FontAwesomeIcon icon={faPlus} /> &nbsp; Add Sample Testcase
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    style={{ color: "#fff", width: "20%" }}
                    size="large"
                    onClick={handleDelete}
                    disabled={children.length === 0}
                    type="button"
                  >
                    Delete &nbsp; <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              </Form.Group>

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/courses")}
                  disabled={loading}
                  sx={{
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
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={20} /> : <Send />
                  }
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

export const NumberField = ({ label, value, setValue, placeholder }) => {
  return (
    <TextField
      label={label}
      type="number"
      value={value}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          //   setStudentLimit(value);
          setValue(value);
        }
      }}
      placeholder={placeholder}
      fullWidth
      required
      variant="outlined"
      sx={{
        "& .MuiInputBase-input": {
          fontSize: "10px", // 設定輸入框文字字體大小
        },
        "& .MuiInputLabel-root": {
          fontSize: "14px", // 設定標籤文字字體大小
        },
      }}
    />
  );
};

const SampleTestcase = ({ i, input, output, setInput, setOutput }) => {
  return (
    <div>
      <Table>
        <tbody>
          <br />
          <tr>
            <Form.Group className="input-output">
              <Form.Label className="sample-testcase-input">
                Sample Input {i + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                name={"input" + (i + 1)}
                rows={3}
                onChange={(e) => setInput([...input, e.target.value])}
              />
              <br />
              <Form.Label className="sample-testcase-output">
                Sample Output {i + 1}
              </Form.Label>
              <Form.Control
                as="textarea"
                name={"output" + (i + 1)}
                rows={3}
                onChange={(e) => setOutput([...output, e.target.value])}
              />
            </Form.Group>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};
