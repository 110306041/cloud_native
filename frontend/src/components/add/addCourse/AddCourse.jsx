import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../../config/config";

const AddCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseSemester, setCourseSemester] = useState("");
  const [studentLimit, setStudentLimit] = useState(0);
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const navigate = useNavigate();

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);
    
    const data = {
      "course_name": courseName,
      "semester": courseSemester,
      "student_limit": studentLimit,
    }

    axios
      .post(`${BACK_SERVER_URL}/api/teacher/courses`, data, {
        headers: {
            Authorization: `Bear ${localStorage.getItem("access-token")}`
        }
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
        navigate(`/courses`)
      })
      .catch((err) => {
        // setLoadingSpinner(false);
        console.log(err)
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
    <>
      <ToastContainer />
      <Form onSubmit={onFormSubmit} autoComplete="off">
        <Form.Group>
          <Form.Label>Course Name</Form.Label>
          <Form.Control
            type="text"
            name="courseName"
            value={courseName}
            placeholder="Course Name"
            onChange={(e) => {
              setCourseName(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Semester</Form.Label>
          <Form.Control
            type="text"
            name="courseSemester"
            value={courseSemester}
            placeholder="ex: 113-1"
            onChange={(e) => {
              setCourseSemester(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Student Limit</Form.Label>
          <Form.Control
            type="text"
            name="studentLimit"
            value={studentLimit}
            placeholder="student limit amount"
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) {
                setStudentLimit(e.target.value.toString());
              } else {
                toast.error("Student limit number can only be natural", {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
              }
            }}
            required
          />
        </Form.Group>
        <div>
          <Button
            variant="contained"
            color="secondary"
            type="cancel"
            style={{ width: "150px", margin: "10px 0px" }}
            onClick={() => {
              navigate(`/courses`);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={courseName === "" || courseSemester === ""}
            style={{ width: "150px", margin: "10px 0px" }}
          >
            {loadingSpinner ? (
              <CircularProgress size={"23px"} style={{ color: "white" }} />
            ) : (
              "Submit"
            )}
            &nbsp;
            {loadingSpinner ? null : <FontAwesomeIcon icon={faPaperPlane} />}
          </Button>
        </div>
      </Form>
    </>
  );
};

export default AddCourse;
