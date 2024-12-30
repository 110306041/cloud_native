import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../../config/config";

const AddExam = () => {
  const [examName, setExamName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [loadingSpinner, setLoadingSpinner] = useState(false);
  const navigate = useNavigate();

  const location = useLocation();
  const courseId = location.state?.id;

  const onFormSubmit = (e) => {
    e.preventDefault();
    setLoadingSpinner(true);

    const startDatetime = new Date(startDate).toISOString();
    const dueDatetime = new Date(dueDate).toISOString();

    const data = {
      exam_name: examName,
      start_date: startDatetime,
      due_date: dueDatetime,
      description: description,
    };

    axios
      .post(`${BACK_SERVER_URL}/api/teacher/exams/${courseId}`, data, {
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
        navigate(`/course/${courseId}`);
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
    <>
      <ToastContainer />
      <Form onSubmit={onFormSubmit} autoComplete="off">
        <Form.Group>
          <Form.Label>Exam Name</Form.Label>
          <Form.Control
            type="text"
            name="examName"
            value={examName}
            placeholder="Exam Name"
            onChange={(e) => {
              setExamName(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="datetime-local"
            name="startDate"
            value={startDate}
            onChange={(e) => {
              setStartDate(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Due Date</Form.Label>
          <Form.Control
            type="datetime-local"
            name="dueDate"
            value={dueDate}
            onChange={(e) => {
              validateDueDate(e.target.value);
            }}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            name="description"
            value={description}
            placeholder="Assignmnet Description Here"
            onChange={(e) => {
              setDescription(e.target.value);
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
              navigate(`/courses/${courseId}`);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={examName === "" || dueDate === "" || startDate === ""}
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

export default AddExam;
