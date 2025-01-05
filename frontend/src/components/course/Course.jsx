import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../config/config";
import DeleteButton from "../editAndDelete/button/DeleteButton";
import EditButton from "../editAndDelete/button/EditButton";
import CourseExam from "./exam/CourseExam";
import CourseHw from "./hw/CourseHw";

export default function Course() {
  const styles = {
    assignmentTitle: {
      marginTop: "0.6rem",
      marginBottom: "0.2rem",
      fontSize: "1.7rem",
      fontWeight: "900",
      color: "#445E93",
    },
  };
  const { id } = useParams();
  const [refreshKey, setRefreshKey] = useState(0);

  const location = useLocation();
  const courseInfo = location.state?.courseInfo;
  console.log(courseInfo);

  const navigate = useNavigate();

  const [hws, setHws] = useState([]);
  const [exams, setExams] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    if (location.state?.refresh) {
      setRefreshKey((prev) => prev + 1);
    }
  }, [location]);

  useEffect(() => {
    let apiUrl =
      localStorage.getItem("role") === "student"
        ? `${BACK_SERVER_URL}/student/assignmentsAndExams/${id}`
        : `${BACK_SERVER_URL}/teacher/assignmentsAndExams/${id}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((res) => {
        console.log(res.data.assignments);
        setHws(res.data.assignments);
        setExams(res.data.exams);
        setLoader(false);
      })
      .catch((err) => {
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
        setLoader(false);
      });
  }, [id, refreshKey]);

  const handleEditButtonClick = (id, courseInfo) => {
    navigate(`/editCourse`, {
      state: { id, courseInfo },
    });
  };

  const handleDeleteButtonClick = async (e) => {
    try {
      await axios.delete(`${BACK_SERVER_URL}/teacher/courses/${id}`, {
        headers: {
          Authorization: `Bear ${localStorage.getItem("access-token")}`,
        },
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
    }
  };

  return (
    <div>
      {loader ? (
        <div className="courses-spinner">
          <BeatLoader color={"#7D99D3"} size={20} loading={loader} />
        </div>
      ) : (
        <div className="courses-container">
          <ToastContainer />
          <div className="courses-right">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <h1 style={styles.assignmentTitle}>
                {courseInfo?.semester} {courseInfo?.name}
              </h1>
              {localStorage.getItem("role") === "student" ? null : (
                <div style={{ marginTop: 13 }}>
                  <EditButton
                    title={"Edit Course"}
                    onClick={() => handleEditButtonClick(id, courseInfo)}
                  />
                  <DeleteButton
                    title={"Delete Course"}
                    onClick={() => handleDeleteButtonClick()}
                  />
                </div>
              )}
            </div>
            <CourseHw hws={hws} courseInfo={courseInfo} />
            <CourseExam exams={exams} courseInfo={courseInfo} />
          </div>
        </div>
      )}
    </div>
  );
}
