import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BACK_SERVER_URL } from "../../../config/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  TextField,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Container,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { Send } from "@mui/icons-material";

const theme = createTheme({
  palette: {
    primary: {
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

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseSemester, setCourseSemester] = useState("");
  const [studentLimit, setStudentLimit] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      course_name: courseName,
      semester: courseSemester,
      student_limit: studentLimit,
    };

    try {
      await axios.post(`${BACK_SERVER_URL}/api/teacher/courses`, data, {
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

      navigate("/courses");
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
          marginTop: "-80px", // 調整負的 margin 來上移
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
                Add New Course
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please fill in the course information below
              </Typography>
            </Box>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <TextField
                label="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="Enter course name"
                fullWidth
                required
                variant="outlined"
              />

              <TextField
                label="Semester"
                value={courseSemester}
                onChange={(e) => setCourseSemester(e.target.value)}
                placeholder="e.g., 113-1"
                fullWidth
                required
                variant="outlined"
              />

              <TextField
                label="Student Limit"
                type="number"
                value={studentLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    setStudentLimit(value);
                  }
                }}
                placeholder="Enter maximum number of students"
                fullWidth
                required
                variant="outlined"
              />

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

export default AddCourse;
