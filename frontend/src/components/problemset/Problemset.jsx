import axios from "axios";

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
import "./problemset.css";
let columns = localStorage.getItem("role") === "student"
  ? problemsetStudentColumn
  : problemsetTeacherColumn;

const styles = {
  assignmentTitle: {
    marginBottom: "1rem",
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  problemsetInfo: {
    display: "flex",
    flexDirection: "column",
    marginTop: "1rem",
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

  useLayoutEffect(() => {
    columns = localStorage.getItem("role") === "student"
      ? problemsetStudentColumn
      : problemsetTeacherColumn;
    
    const apiUrl = localStorage.getItem("role") === "student"
      ? `${BACK_SERVER_URL}/api/student/${problemsetInfo.problemType}/questions/${id}`
      : `${BACK_SERVER_URL}/api/teacher/${problemsetInfo.problemType}/questions/${id}`;

    axios
      .get(
        `${BACK_SERVER_URL}/api/student/${problemsetInfo.problemType}/questions/${id}`, //TODO: change to apiUrl
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access-token")}`,
          },
        }
      )
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

  return (
    <div className="courses-container">
      <ToastContainer />
      <div className="courses-right">
        <h2 style={styles.assignmentTitle}>
          {problemsetInfo.courseInfo.semester} {problemsetInfo.courseInfo.name}
        </h2>
        <h2 style={styles.assignmentTitle}></h2>
        <h2 style={{ color: "#445E93" }}>{problemsetInfo.problemsetName}</h2>

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

        <Paper
          sx={{
            width: "100%",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "40px",
            marginTop: "20px",
          }}
        >
          <TableContainer>
            {loader && (
              <div className="loader-container">
                <BeatLoader color={"#343a40"} size={30} loading={loader} />
              </div>
            )}
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundColor: "#FFF9D0",
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
