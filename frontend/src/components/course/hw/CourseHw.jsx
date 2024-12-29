import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BeatLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { courseHwStudentColumn, courseHwTeacherColumn, getDateTime } from "../../../utils";

const columns = localStorage.getItem("role") === "student"
  ? courseHwStudentColumn
  : courseHwTeacherColumn;

export default function CourseHw({ hws = [], courseInfo }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allHws, setAllHws] = useState(hws);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getPageData = () => {
      let filtered = allHws;
      if (searchQuery) {
        filtered = allHws.filter((p) =>
          p.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        );
        setRows(filtered);
      } else {
        setRows(filtered);
      }
    };
    getPageData();
  }, [searchQuery, allHws]);

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
      {loader ? (
        <div className="courses-spinner">
          <BeatLoader color={"#343a40"} size={30} loading={loader} />
        </div>
      ) : (
        <div>
          <h3 style={{ padding: "20px 0" }}>Assignments</h3>
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
                              allHws[page * rowsPerPage + index].id,
                              {
                                courseInfo: courseInfo,
                                problemType: "assignments",
                                problemsetName: row.name,
                                startDate: row.startDate,
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
                            if (column.id === "dueDate") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <span
                                    style={{
                                      fontWeight: "regular",
                                      fontSize: "16px",
                                      color: "#222222",
                                    }}
                                  >
                                    {getDateTime(row.due_date)}
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
                            } else if (column.id === "status") {
                              let badgeColor;
                              switch (value) {
                                case "completed":
                                  badgeColor = "#8ACB88"; // 綠色
                                  break;
                                case "overdue":
                                  badgeColor = "#FA7272"; // 紅色
                                  break;
                                case "in progress":
                                  badgeColor = "#5AB2FF"; // 藍色
                                  break;
                                default:
                                  badgeColor = "#D9D9D9"; // 預設灰色，以防有其他狀態
                              }

                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <Chip
                                    label={value}
                                    style={{
                                      fontWeight: "bold",
                                      color: "white",
                                      backgroundColor: badgeColor,
                                      textTransform: "capitalize", // 讓文字首字母大寫
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
                                      textOverflow: "ellipsis",
                                      maxWidth: column.maxWidth,
                                      display: "inline-block",
                                      overflow: "hidden",
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
      )}
    </div>
  );
}
