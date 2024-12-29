import axios from "axios";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import { BACK_SERVER_URL } from "../../config/config";

import "react-toastify/dist/ReactToastify.css";
import "./problemset.css";

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
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getDateTime } from "../../utils";

const columns = [
  { id: "id", label: "#", minWidth: 10 },
  { id: "name", label: "Problem Name", minWidth: 200 },
  { id: "difficulty", label: "Difficulty", minWidth: 50 },
  { id: "score", label: "Score", minWidth: 100 },
];

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
    axios
      .get(
        `${BACK_SERVER_URL}/api/student/${problemsetInfo.problemType}/questions/${id}`,
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
    <div className="problemset-container">
      <ToastContainer />
      {/* <div className="problemset-left">
        <Sidebar
          problems={allProblems}
          setRows={setRows}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          tagsSelected={tagsSelected}
          setTagsSelected={setTagsSelected}
        />
      </div> */}
      <div className="problemset-right">
        {/* <SearchBar
          value={searchQuery}
          onChange={(newValue) => setSearchQuery(newValue)}
          onRequestSearch={() => setSearchQuery(searchQuery)}
          className="problem-searchbar"
        /> */}
        <div className="problemset-spinner">
          <BeatLoader color={"#343a40"} size={30} loading={loader} />
        </div>
        <div className="problemset-courseInfo">
          {problemsetInfo.courseInfo.semester} {problemsetInfo.courseInfo.name}
        </div>
        <div className="problemset-info">{problemsetInfo.problemsetName}</div>
        <div className="problemset-info">
          {problemsetInfo.startDate
            ? `Start Date: ${getDateTime(problemsetInfo.startDate)}`
            : `Start Date: ${problemsetInfo.startDate}`}
          {/* Start Date: {getDateTime(problemsetInfo.startDate)} */}
        </div>
        <div className="problemset-info">
          Due Date: {getDateTime(problemsetInfo.dueDate)}
        </div>
        <Paper sx={{ width: "100%", height: "950px" }}>
          <TableContainer sx={{ maxHeight: 950 }}>
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
                          navigate(
                            `/problem/${
                              allProblems[page * rowsPerPage + index].id
                            }`
                          )
                        }
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
                                <div
                                  style={{ display: "flex", columnGap: "5px" }}
                                >
                                  {value} / 100
                                </div>
                              </TableCell>
                            );
                          } else if (column.id === "difficulty") {
                            let badgeColor = "#5caf5c";
                            if (value === "Easy") badgeColor = "#FF980d";
                            else if (value === "Hard") badgeColor = "#F44336";

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
