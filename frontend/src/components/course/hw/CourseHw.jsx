import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "react-toastify/dist/ReactToastify.css";
import "./courseHw.css";

import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { getDateTime } from "../../../utils";
// import SearchBar from "material-ui-search-bar";


const columns = [
  { id: "id", label: "#", minWidth: 10 },
  { id: "name", label: "Homework Name", minWidth: 100 },
  { id: "question_count", label: "Question amount", minWidth: 50 },
  { id: "status", label: "Status", minWidth: 50 },
  // { id: "startDate", label: "Start Date", minWidth: 50 },
  { id: "dueDate", label: "Due Date", minWidth: 50 },
  { id: "score", label: "Score", minWidth: 100 },
];

export default function CourseHw({ hws = [], courseInfo }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allHws, setAllHws] = useState(hws);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

    // eslint-disable-next-line
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
      state: { problemsetInfo } // 傳遞額外資訊
    });
  };

  return (
    <div className="courses-container">
      {/* <ToastContainer /> */}
      <div className="courses-right">
        {/* <SearchBar
          value={searchQuery}
          onChange={(newValue) => setSearchQuery(newValue)}
          onRequestSearch={() => setSearchQuery(searchQuery)}
          className="courses-searchbar"
        /> */}
        <span style={{color: 'white'}}>HW</span>
        <Paper sx={{ width: "100%", height: "300px" }}>
          <TableContainer sx={{ maxHeight: 400 }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
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
                          handleRowClick(allHws[page * rowsPerPage + index].id, {
                            courseInfo: courseInfo,
                            problemType: "assignments",
                            problemsetName: row.name,
                            startDate: row.startDate,
                            dueDate: row.due_date,
                          })
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
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    color: "#1a237e",
                                  }}
                                >
                                  {getDateTime(row.due_date)}
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "score") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <div
                                  style={{ display: "flex", columnGap: "5px" }}
                                >
                                  {value} / 100
                                </div>
                              </TableCell>
                            );
                          } else if (column.id === "status") {
                            let badgeColor = "blue";
                            if (value === "overdue") badgeColor = "#F44336";

                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Chip
                                  label={value}
                                  style={{
                                    fontWeight: "bold",
                                    color: "white",
                                    display: "flex",
                                    backgroundColor: badgeColor,
                                  }}
                                />
                              </TableCell>
                            );
                          } else {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    color: "#1a237e",
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
