import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./courseExam.css";

import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import {
  courseExamStudentColumn,
  courseExamTeacherColumn,
  getDateTime,
} from "../../../utils";

let columns =
  localStorage.getItem("role") === "student"
    ? courseExamStudentColumn
    : courseExamTeacherColumn;

export default function CourseHw({ exams = [], courseInfo }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allExams, setAllExams] = useState(exams);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    columns =
      localStorage.getItem("role") === "student"
        ? courseExamStudentColumn
        : courseExamTeacherColumn;

    const getPageData = () => {
      let filtered = allExams;
      if (searchQuery) {
        filtered = allExams.filter((p) =>
          p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setRows(filtered);
      } else {
        setRows(filtered);
      }
    };
    getPageData();
  }, [searchQuery, allExams]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };

  const handleRowClick = (problemsetId, problemsetInfo) => {
    navigate(`/problemset/${problemsetId}`, {
      state: { problemsetInfo },
    });
  };

  const handleButtonClick = (id) => {
    navigate(`/addExam`, {
      state: { id },
    });
  };

  return (
    <div>
      <div
        style={{
          display: "flex", // 使用 Flexbox 佈局
          justifyContent: "space-between", // 元素兩端對齊
          alignItems: "center", // 垂直方向居中
          padding: "10px 0",
        }}
      >
        <h2 style={{ padding: "20px 0", color: "#222222" }}>Exam</h2>
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
            onClick={() => handleButtonClick(id)}
          >
            Add Exam
          </Button>
        )}
      </div>
      <Paper
        sx={{
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "40px",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 550, // 限制高度
            overflowY: "scroll", // 保持滾動行為
            scrollbarGutter: "stable", // 確保滾動條佔位
          }}
        >
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
                      onClick={() =>
                        handleRowClick(
                          allExams[page * rowsPerPage + index].id,
                          {
                            courseInfo: courseInfo,
                            problemType: "exams",
                            problemsetName: row.name,
                            startDate: row.start_date,
                            dueDate: row.due_date,
                          }
                        )
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {columns.map((column) => {
                        const value =
                          column.id === "id"
                            ? page * rowsPerPage + index + 1
                            : row[column.id];
                        if (
                          column.id === "dueDate" ||
                          column.id === "startDate"
                        ) {
                          return (
                            <TableCell key={column.id} align={column.align}>
                              <span
                                style={{
                                  fontWeight: "regular",
                                  fontSize: "16px",
                                  color: "#222222",
                                }}
                              >
                                {getDateTime(
                                  column.id === "dueDate"
                                    ? row.due_date
                                    : row.start_date
                                )}
                              </span>
                            </TableCell>
                          );
                        } else if (column.id === "score") {
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
  );
}
