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
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../../config/config";

// 創建自定義主題
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

const AddHw = () => {
  const [assignmentName, setAssignmentName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const courseId = location.state?.id;

  useEffect(() => {
    if (!courseId) {
      console.error("No courseId provided");
      toast.error("Course ID is missing");
      navigate("/courses");
      return;
    }
    console.log("Current courseId:", courseId);
  }, [courseId, navigate]);

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);

    setLoadingSpinner(true);
    if (!courseId) {
      setLoadingSpinner(false);
      toast.error("Course ID is missing");
      return;
    }

    const data = {
      assignment_name: assignmentName,
      start_date: new Date(startDate).toISOString(),
      due_date: new Date(dueDate).toISOString(),
      description: description,
    };

    axios
      .post(`${BACK_SERVER_URL}/api/teacher/assignments/${courseId}`, data, {
        headers: {
          Authorization: `Bear ${localStorage.getItem("access-token")}`,
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        setLoadingSpinner(false);
        toast.success("HW Created Successfully");
        // 修改這行，添加 state 參數
        navigate(`/course/${courseId}`, {
          state: {
            refresh: true,
          },
        });
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
  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "#f5f5f5",
          marginTop: "-10px",
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
                Add New Assignment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please fill in the assignment information below
              </Typography>
            </Box>

            <form
              onSubmit={onFormSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
              autoComplete="off"
            >
              <TextField
                label="Assignment Name"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                placeholder="Enter assignment name"
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
                onChange={(e) => setDueDate(e.target.value)}
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
                placeholder="Assignment Description Here"
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
                  onClick={() => navigate(`/course/${courseId}`)}
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

export default AddHw;
