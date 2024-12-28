import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
// import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BACK_SERVER_URL } from "../../../config/config";

// import "react-toastify/dist/ReactToastify.css";
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
// import SearchBar from "material-ui-search-bar";

import { getDifficulty } from "../../../utils";

const columns = [
  { id: "id", label: "#", minWidth: 10 },
  { id: "name", label: "Homework Name", minWidth: 100 },
  { id: "questions", label: "Question amount", minWidth: 50 },
  { id: "status", label: "Status", minWidth: 50 },
  { id: "startDate", label: "Start Date", minWidth: 50 },
  { id: "dueDate", label: "Due Date", minWidth: 50 },
  { id: "score", label: "Score", minWidth: 100 },
];

export default function CourseHw({ hws = [], courseInfo }) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [allHws, setAllHws] = useState(hws);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useLayoutEffect(() => {
    axios
      .get(`${BACK_SERVER_URL}/api/problem`)
      .then((res) => {
        let problems = res.data;

        problems.forEach((problem, i) => {
          problem["difficulty"] = getDifficulty(problem);
        });

        setAllHws(problems);
        setRows(problems);
        setLoader(false);
      })
      .catch((err) => {
        const error = err.response ? err.response.data.message : err.message;
        // toast.error(error, {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
      });
  }, []);

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
        <div className="courses-spinner">
          <BeatLoader color={"#343a40"} size={30} loading={loader} />
        </div>
        <span style={{color: 'white'}}>HW</span>
        <Paper sx={{ width: "100%", height: "300px" }}>
          {/* <Paper sx={{ width: "100%" }}> */}
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
                            problemsetName: row.name,
                            startDate: row.startDate,
                            dueDate: row.dueDate,
                          })
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
                                    fontWeight: "bold",
                                    fontSize: "15px",
                                    color: "#1a237e",
                                  }}
                                >
                                  {row.doneHw} / {row.totalHw}
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
                            // else if (value === "Hard") badgeColor = "#F44336";

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
