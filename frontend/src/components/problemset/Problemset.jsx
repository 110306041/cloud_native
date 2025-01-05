import axios from "axios";

import { Button } from "@mui/material";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../config/config";
import {
  getDateTime,
  problemsetStudentColumn,
  problemsetTeacherColumn,
} from "../../utils";
import DeleteButton from "../editAndDelete/button/DeleteButton";
import EditButton from "../editAndDelete/button/EditButton";
import "./problemset.css";

let columns =
  localStorage.getItem("role") === "student"
    ? problemsetStudentColumn
    : problemsetTeacherColumn;

const styles = {
  assignmentTitle: {
    marginTop: "0.6rem",
    marginBottom: "0.2rem",
    fontSize: "1.7rem",
    fontWeight: "900",
    color: "#445E93",
  },
  infoAndButton: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  problemsetInfo: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "1rem",
  },
  infoLabel: {
    display: "block",
    marginBottom: "0.2rem",
  },
};
export default function ProblemSet() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allProblems, setAllProblems] = useState([]);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { id } = useParams();
  const location = useLocation();
  const problemsetInfo = location.state?.problemsetInfo;
  const navigate = useNavigate();
  console.log(problemsetInfo);

  useLayoutEffect(() => {
    columns =
      localStorage.getItem("role") === "student"
        ? problemsetStudentColumn
        : problemsetTeacherColumn;

    const apiUrl =
      localStorage.getItem("role") === "student"
        ? `${BACK_SERVER_URL}/student/${problemsetInfo.problemType}/questions/${id}`
        : `${BACK_SERVER_URL}/teacher/${problemsetInfo.problemType}/questions/${id}`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((res) => {
        let problems = res.data.questions;

        setAllProblems(problems);
        setRows(problems);
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
      });
  }, [id]);

  useEffect(() => {
    const getPageData = () => {
      let filtered = allProblems;
      if (searchQuery) {
        filtered = allProblems.filter((p) =>
          p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setRows(filtered);
      } else {
        setRows(filtered);
      }
    };
    getPageData();

    // eslint-disable-next-line
  }, [searchQuery, allProblems]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };

  const handleRowClick = (problemId, problemsetInfo) => {
    navigate(`/problemset/${problemId}`, {
      state: { problemsetInfo }, // 傳遞額外資訊
    });
  };

  const handleButtonClick = (id, problemtype) => {
    navigate(`/addProblem`, {
      state: { id, problemtype },
    });
  };

  const handleEditButtonClick = (id, problemsetInfo) => {
    if (problemsetInfo.problemType === "assignments") {
      navigate(`/editHw`, {
        state: { id, problemsetInfo },
      });
    }
    if (problemsetInfo.problemType === "exams") {
      navigate(`/editExam`, {
        state: { id, problemsetInfo },
      });
    }
  };

  const handleDeleteButtonClick = async (e) => {
    // const type =
    console.log(
      `${BACK_SERVER_URL}/teacher/${problemsetInfo.problemType}/${id}`
    );
    try {
      await axios.delete(
        `${BACK_SERVER_URL}/teacher/${problemsetInfo.problemType}/${id}`,
        {
          headers: {
            Authorization: `Bear ${localStorage.getItem("access-token")}`,
          },
        }
      );
      navigate("/courses/");
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
    <div className="courses-container">
      <ToastContainer />

      <div className="courses-right">
        {loader && (
          <div className="loader-container">
            <BeatLoader color={"#7D99D3"} size={20} loading={loader} />
          </div>
        )}
        <h1 style={styles.assignmentTitle}>
          {problemsetInfo.courseInfo.semester} {problemsetInfo.courseInfo.name}
        </h1>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <h2 style={{ padding: "20px 0", color: "#222222" }}>
            {problemsetInfo.problemsetName}
          </h2>
          {localStorage.getItem("role") === "student" ? null : (
            <div style={{ marginTop: 13 }}>
              <EditButton
                title={
                  problemsetInfo.problemType === "assignments"
                    ? "Edit Assignment"
                    : "Edit Exam"
                }
                onClick={() => handleEditButtonClick(id, problemsetInfo)}
              />
              <DeleteButton
                title={
                  problemsetInfo.problemType === "assignments"
                    ? "Delete Assignment"
                    : "Edit Exam"
                }
                onClick={() => handleDeleteButtonClick()}
              />
            </div>
          )}
        </div>

        <div style={styles.infoAndButton}>
          <div style={styles.problemsetInfo}>
            <div style={styles.infoLabel}>
              <span>
                Start Date:{" "}
                {problemsetInfo.startDate
                  ? getDateTime(problemsetInfo.startDate)
                  : problemsetInfo.startDate}
              </span>
            </div>

            <span style={styles.infoLabel}>
              Due Date: {getDateTime(problemsetInfo.dueDate)}
            </span>
          </div>
          {localStorage.getItem("role") === "student" ? null : (
            <Button
              type="submit"
              color="primary"
              variant="contained"
              className="add-course-btn"
              sx={{
                backgroundColor: "#445E93",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#29335C",
                },
              }}
              onClick={() => handleButtonClick(id, problemsetInfo.problemType)}
            >
              Add Problem
            </Button>
          )}
        </div>

        <Paper
          sx={{
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "40px",
            marginTop: "20px",
          }}
        >
          <TableContainer sx={{ maxWidth: "100%" }}>
            <Table
              sx={{ minWidth: 800 }}
              stickyHeader
              aria-label="sticky table"
            >
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundColor: "#FFF9D0",
                        whiteSpace: "nowrap", // Add this to prevent wrapping
                        overflow: "hidden", // Add this to handle overflow
                        textOverflow: "ellipsis", // Add this to show ellipsis if text overflows
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
                        onClick={() => {
                          navigate(
                            `/problem/${
                              allProblems[page * rowsPerPage + index].id
                            }`
                          );
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        {columns.map((column) => {
                          const value =
                            column.id === "id"
                              ? page * rowsPerPage + index + 1
                              : row[column.id];
                          if (column.id === "description") {
                            return (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                sx={{
                                  maxWidth: "250px",
                                  fontSize: "16px", // 直接設定在 TableCell 上
                                  "& span": {
                                    fontSize: "inherit", // 繼承父元素的字體大小
                                    display: "block",
                                    whiteSpace: "normal",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    wordBreak: "break-word",
                                    padding: "8px 0",
                                    maxWidth: "100%",
                                  },
                                }}
                              >
                                <span>{value}</span>
                              </TableCell>
                            );
                          }
                          if (column.id === "score") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                  }}
                                >
                                  {value} / 100
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "difficulty") {
                            let badgeColor;
                            const normalizedValue = value?.toLowerCase();
                            switch (normalizedValue) {
                              case "easy":
                                badgeColor = "#8ACB88";
                                break;
                              case "hard":
                                badgeColor = "#FA7272";
                                break;
                              case "medium":
                                badgeColor = "#5AB2FF";
                                break;
                              default:
                                badgeColor = "#D9D9D9";
                                console.log(
                                  "Default case triggered for value:",
                                  value
                                );
                            }

                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Chip
                                  label={value}
                                  style={{
                                    fontWeight: "bold",
                                    color: "white",

                                    backgroundColor: badgeColor,
                                    textTransform: "capitalize",
                                  }}
                                />
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                    display: "block", // 填滿單元格寬度
                                    whiteSpace: "normal", // 允許自動換行
                                    overflow: "hidden", // 隱藏溢出的內容（若需要）
                                    maxWidth: 300,
                                  }}
                                >
                                  {value}
                                </span>
                              </TableCell>
                            );
                          }
                        })}
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </div>
    </div>
  );
}
