import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./courseExam.css";

import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { getDateTime } from "../../../utils";

const columns = [
  { id: "id", label: "#", minWidth: 50, maxWidth: 70, align: "center" },
  { id: "name", label: "Homework Name", minWidth: 150, align: "left" },
  {
    id: "startDate",
    label: "Start Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
  {
    id: "dueDate",
    label: "Due Date",
    minWidth: 120,
    maxWidth: 150,
    align: "center",
  },
  {
    id: "score",
    label: "Score",
    minWidth: 100,
    maxWidth: 120,
    align: "center",
  },
];

export default function CourseHw({ exams = [], courseInfo }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allExams, setAllExams] = useState(exams);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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

  return (
    <div>
      <h3 style={{ padding: "20px 0" }}>Exam</h3>
      <Paper
        sx={{
          width: "100%",
          height: "450px",
          borderRadius: "16px",
          overflow: "hidden",
          marginBottom: "40px",

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
  );
}
