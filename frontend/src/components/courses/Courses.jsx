import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { BACK_SERVER_URL } from "../../config/config";

import "react-toastify/dist/ReactToastify.css";
import "./courses.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import SearchBar from "material-ui-search-bar";
const columns = [
  { id: "id", label: "#", minWidth: 30, maxWidth: 50, align: "center" },
  { id: "semester", label: "Semester", minWidth: 120, maxWidth: 150, align: "left" },
  { id: "name", label: "Course Name", minWidth: 250, align: "left" },
  { id: "hw", label: "Homework", minWidth: 100, maxWidth: 120, align: "center" },
  { id: "exam", label: "Exam", minWidth: 100, maxWidth: 120, align: "center" },
];

export default function Courses() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allCourses, setAllCourses] = useState([]);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    axios
      .get(`${BACK_SERVER_URL}/api/student/courses`, {
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
          <BeatLoader color={"#343a40"} size={30} loading={loader} />
        </div>
        <h2 style={{ padding: "20px 0" }}>Course</h2>
        <Paper
          sx={{
            width: "100%",
            height: "550px",
            borderRadius: "16px",
            overflow: "hidden",
          }}
        >
          <TableContainer sx={{ maxHeight: 550 }}>
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
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                  }}
                                >
                                  {row.completed_assignments} /{" "}
                                  {row.total_assignments}
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "exam") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                  }}
                                >
                                  {row.completed_assignments} /{" "}
                                  {row.total_assignments}
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "exam") {
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
            rowsPerPageOptions={[10, 25, 100]}
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
