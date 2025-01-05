import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Container,
    Paper,
    ThemeProvider,
    Typography,
    createTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../../config/config";

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
  },
});

const AddStudent = () => {
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const navigate = useNavigate();

  const location = useLocation();
  const courseId = location.state?.id;
  console.log(courseId)

  useEffect(() => {
    axios
      .get(`${BACK_SERVER_URL}/teacher/enroll/students`, {
        headers: {
          Authorization: `Bear ${localStorage.getItem("access-token")}`,
        },
      })
      .then((res) => {
        console.log(res.data);
        setStudents(res.data.students);
      })
      .catch((error) => {
        toast.error("Failed to load students.");
        console.error(error);
      });
  }, []);

  const handleCheckboxChange = (studentID) => {
    setSelectedStudents((prev) =>
      prev.includes(studentID)
        ? prev.filter((id) => id !== studentID)
        : [...prev, studentID]
    );
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);

    if (selectedStudents.length === 0) {
      toast.warn("Please select at least one student.");
      return;
    }

    axios
      .post(
        `${BACK_SERVER_URL}/teacher/enroll/students/${courseId}`,
        { studentIds: selectedStudents },
        {
          headers: {
            Authorization: `Bear ${localStorage.getItem("access-token")}`,
          },
        }
      )
      .then(() => {
        setLoadingSpinner(false);
        toast.success("Students added successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setSelectedStudents([]);
        navigate(-1);
      })
      .catch((err) => {
        console.log(selectedStudents)
        setLoadingSpinner(false);
        console.log(err);
        const error = err.response ? err.response.data.error : err.message;
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
                Enroll Students in Course
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please select students from the list below to grant them access to this course.
              </Typography>
            </Box>

            <form
              onSubmit={onFormSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              {students.map((student) => (
                <div
                  key={student.ID}
                  style={{ display: "flex", alignItems: "center", gap: "24px" }}
                >
                  <Checkbox
                    checked={selectedStudents.includes(student.ID)}
                    onChange={() => handleCheckboxChange(student.ID)}
                  />
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>{student.Name}</span>
                    <span style={{ fontSize: "15px", color: grey[600] }}>
                      {student.Email}
                    </span>
                  </div>
                </div>
              ))}

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

export default AddStudent;
