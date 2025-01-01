import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { BACK_SERVER_URL } from "../../config/config";

import "react-toastify/dist/ReactToastify.css";
import "./courses.css";

import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { courses } from "../../utils";
// import SearchBar from "material-ui-search-bar";
const columns = courses;

export default function Courses() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allCourses, setAllCourses] = useState([]);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    let apiUrl =
      localStorage.getItem("role") === "student"
        ? `${BACK_SERVER_URL}/student/courses`
        : `${BACK_SERVER_URL}/teacher/courses`;

    axios
      .get(apiUrl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access-token")}`,
        },
      })
      .then((res) => {
        let courses = res.data.courses;

        setAllCourses(courses);
        setRows(courses);
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
  }, []);

  useEffect(() => {
    const getPageData = () => {
      let filtered = allCourses;
      if (searchQuery) {
        filtered = allCourses.filter((p) =>
          p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setRows(filtered);
      } else {
        setRows(filtered);
      }
    };
    getPageData();

    // eslint-disable-next-line
  }, [searchQuery, allCourses]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };

  const handleRowClick = (courseId, courseInfo) => {
    navigate(`/course/${courseId}`, {
      state: { courseInfo }, // 傳遞額外資訊
    });
  };

  return (
    <div className="courses-container">
      <ToastContainer />
      <div className="courses-right">
        <div className="courses-spinner">
          <BeatLoader color={"#7D99D3"} size={20} loading={loader} />
        </div>
        <div
          style={{
            display: "flex", // 使用 Flexbox 佈局
            justifyContent: "space-between", // 元素兩端對齊
            alignItems: "center", // 垂直方向居中
            padding: "20px 0",
          }}
        >
          <h2>Courses</h2>
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
              onClick={() => {
                navigate(`/addCourse`);
              }}
            >
              Add Course
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
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundColor: "#FFF9D0", // 設置背景顏色
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
                            allCourses[page * rowsPerPage + index].id,
                            {
                              semester: row.semester,
                              name: row.name,
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
                          if (column.id === "hw") {
                            console.log('HW Data:', {
                              completed: row.completed_assignments,
                              total: row.total_assignments,
                              row: row
                            });
                            let assignmentsDisplay =
                              localStorage.getItem("role") === "student"
                                ? `${row.completed_assignments} / ${row.total_assignments}`
                                : row.total_assignments;
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                  }}
                                >
                                  {assignmentsDisplay}
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "exam") {
                            console.log('Exam Data:', {
                              active: row.active_exams,
                              row: row
                            });
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    minWidth: column.minWidth,
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                  }}
                                >
                                  {row.active_exams}
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
    </div>
  );
}
