import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../config/config";

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

const EditExam = () => {
  const location = useLocation();
  const typeId = location.state?.id;
  const problemsetInfo = location.state?.problemsetInfo;
  const courseInfo = problemsetInfo.courseInfo;
  console.log(courseInfo)
  console.log(problemsetInfo);

  const [examName, setExamName] = useState(problemsetInfo.problemsetName);
  const [startDate, setStartDate] = useState(problemsetInfo.startDate);
  const [dueDate, setDueDate] = useState(problemsetInfo.dueDate);
  const [description, setDescription] = useState(problemsetInfo.description);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);

    const startDatetime = new Date(startDate).toISOString();
    const dueDatetime = new Date(dueDate).toISOString();

    const data = {
      Name: examName,
      StartDate: startDatetime,
      DueDate: dueDatetime,
      Description: description,
    };

    axios
      .put(`${BACK_SERVER_URL}/teacher/exams/${typeId}`, data, {
        headers: {
          Authorization: `Bear ${localStorage.getItem("access-token")}`,
        },
      })
      .then(() => {
        setLoadingSpinner(false);
        toast.success("Course Created Successfully", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        navigate("/courses");
      })
      .catch((err) => {
        setLoadingSpinner(false);
        console.log(err);
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

  const validateDueDate = (value) => {
    const selectedDueDate = new Date(value);
    const selectedStartDate = new Date(startDate);
    if (startDate && selectedDueDate < selectedStartDate) {
      toast.error("Due date cannot be earlier than the start date.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      setDueDate(value);
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
          //   marginTop: "-10px", // 調整負的 margin 來上移
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
                Edit Exam
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please fill in the exam information below
              </Typography>
            </Box>

            <form
              onSubmit={onFormSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <TextField
                label="Exam Name"
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                placeholder="Enter exam name"
                fullWidth
                required
                variant="outlined"
              />

              <TextField
                label="Start Date"
                type="datetime-local"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="Due Date"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => validateDueDate(e.target.value)}
                fullWidth
                required
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />

              <TextField
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Exam Description Here"
                fullWidth
                required
                variant="outlined"
                multiline
                rows={4}
              />

              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate(-1)}
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

                <Button type="submit" variant="contained" fullWidth>
                  {loadingSpinner ? (
                    <CircularProgress size={23} sx={{ color: "white" }} />
                  ) : (
                    <>
                      Submit &nbsp;
                      <FontAwesomeIcon icon={faPaperPlane} />
                    </>
                  )}
                </Button>
              </Box>
            </form>
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default EditExam;
