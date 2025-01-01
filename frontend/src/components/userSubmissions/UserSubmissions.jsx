/* eslint-disable jsx-a11y/anchor-is-valid */
import axios from "axios";
import React, { useLayoutEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { ToastContainer } from "react-toastify";
import { BACK_SERVER_URL } from "../../config/config";
import "../courses/courses.css";

import "react-toastify/dist/ReactToastify.css";
// import "./userSubmission.css";

import Chip from "@mui/material/Chip";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
// import { makeStyles } from "@material-ui/core/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";

import { getDateTime } from "../../utils";
import Submission from "./submission/Submission";

const columns = [
  { id: "id", align: "center", label: "#", minWidth: 30, maxWidth: 50 },
  { id: "problemName", align: "center", label: "Problem Name", minWidth: 80 },
  { id: "CreatedAt", align: "center", label: "When", minWidth: 70 },
  { id: "Language", align: "center", label: "Language", minWidth: 60 },
  { id: "TimeSpend", align: "center", label: "Time Spend", minWidth: 60 },
  { id: "MemoryUsage", align: "center", label: "Memory Usage", minWidth: 60 },
  { id: "Score", align: "center", label: "Score", minWidth: 70 },
  // { id: "verdict", align: "center", label: "Verdict", minWidth: 70 },
];

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     position: "absolute",
//     width: 1000,
//     backgroundColor: theme.palette.background.paper,
//     border: "2px solid #000",
//     boxShadow: theme.shadows[5],
//     padding: theme.spacing(2, 4, 3),
//   },
//   root: {
//     width: "100%",
//     height: "calc(100vh - 100px)",
//   },
//   container: {
//     maxHeight: "75vh",
//   },
// }));

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

export default function UserSubmissions() {
  //   const classes = useStyles();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [rows, setRows] = useState([]);
  const [loader, setLoader] = useState(true);
  const [modalStyle] = useState(getModalStyle);
  const [modalState, setModalState] = useState({ submission: {}, open: false });
  // const [hasSubmissions, setHasSubmissions] = useState(true);
  const [submissions, setSubmissions] = useState([])
  const verdictMap = {
    AC: "Accepted",
    WA: "Wrong Answer",
    CE: "Compilation Error",
    RTE: "Runtime Error",
    TLE: "Time Limit Exceeded",
    MLE: "Memory Limit Exceeded",
  };
  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "AC":
        return "#80CD7D"; // 綠色
      case "WA":
        return "#FA7272"; // 紅色
      case "CE":
        return "#FACE77"; // 黃色
      case "RTE":
        return "#B4ADEA"; // 紫色
      case "TLE":
      case "MLE":
        return "#5AB2FF"; // 藍色
      default:
        return "#CCAE97"; // 棕色
    }
  };

  const langMap = {
    c: "C",
    cpp: "C++",
    java: "Java8",
    python: "Python3",
  };

  useLayoutEffect(() => {
    // const parseJwt = (token) => {
    //   var base64Url = token.split(".")[1];
    //   var base64 = base64Url.replace("-", "+").replace("_", "/");
    //   return JSON.parse(window.atob(base64));
    // };

    // const accessToken = localStorage.getItem("access-token");
    // const userId = parseJwt(accessToken).sub;

    axios
      .get(`${BACK_SERVER_URL}/student/submissions`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("access-token")}` },
      })
      .then((res) => {
        let submissions = res.data.submissions;
        setSubmissions(submissions)
        setRows(submissions)
        // if (!res.data || res.data.length === 0) setHasSubmissions(false);
        // else setRows(res.data);
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

  const handleClick = (i) => {
    const curSubmission = rows[i];
    setModalState({
      submission: curSubmission,
      open: true,
    });
  };

  const handleClose = () => {
    setModalState({
      ...modalState,
      open: false,
    });
  };

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(e.target.value);
    setPage(0);
  };

  const body = (
    // <div style={modalStyle} className={classes.paper}>
    <div
      style={modalStyle}
      className={{
        position: "absolute",
        width: 1000,
        // backgroundColor: theme.palette.background.paper,
        border: "2px solid #000",
        // boxShadow: theme.shadows[5],
        // padding: theme.spacing(2, 4, 3),
      }}
    >
      <h3 className="usersubmission-modal-title" id="simple-modal-title">
        {modalState.submission.problemName}
      </h3>
      <p className="usersubmission-modal-details">
        <Chip
          label={verdictMap[modalState.submission.verdict]}
          style={{
            fontWeight: "bold",
            color: "white",
            maxWidth: "200px",
            backgroundColor:
              modalState.submission.verdict === "AC" ? "#5cb85c" : "#F44336",
          }}
        />
      </p>
      <p className="usersubmission-modal-details">
        By
        <Link className="usersubmission-modal-username" to="/dashboard">
          {localStorage.getItem("username")}
        </Link>
      </p>
      <hr className="usersubmission-modal-hr" />
      <Submission submission={modalState.submission} />
    </div>
  );

  return submissions === false ? (
    <>{/* <NoContent /> */}</>
  ) : (
    <div className="courses-container">
      <ToastContainer />
      <div className="courses-right">
        <div className="courses-spinner">
          <BeatLoader color={"#7D99D3"} size={20} loading={loader} />
        </div>
        <h2 style={{ padding: "20px 0" }}>Submissions</h2>

        {/* <Paper className={classes.root}> */}
        <Paper
          sx={{
            width: "100%",
            minHeight: "600px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "20px",
          }}
        >
          {" "}
          {/* <TableContainer className={classes.container}> */}
          <TableContainer className={{ maxHeight: "75vh" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth || "auto",
                        fontWeight: "bold",
                        fontSize: "16px",
                        backgroundColor: "#FFF9D0", // 新增黃色背景
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
                        key={row.code}
                      >
                        {columns.map((column) => {
                          const value =
                            column.id === "id" ? index + 1 : row[column.id];
                          if (column.id === "date") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <span
                                  style={{
                                    fontWeight: "regular",
                                    fontSize: "16px",
                                    color: "#222222",
                                  }}
                                >
                                  {getDateTime(value)}
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "problemName") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <a
                                  href="#"
                                  onClick={() => handleClick(index)}
                                  style={{
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                    textDecoration: "none",

                                    color: "#445E93 ",
                                  }}
                                >
                                  {value}
                                </a>
                                <Modal
                                  open={modalState.open}
                                  onClose={handleClose}
                                  aria-labelledby="simple-modal-title"
                                  aria-describedby="simple-modal-description"
                                >
                                  {body}
                                </Modal>
                              </TableCell>
                            );
                          } else if (column.id === "verdict") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Chip
                                  label={verdictMap[value]}
                                  style={{
                                    fontWeight: "bold",
                                    color: "white",
                                    maxWidth: "200px",
                                    backgroundColor: getVerdictColor(value),
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
                                  {column.id === "lang"
                                    ? langMap[value]
                                    : value}
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
