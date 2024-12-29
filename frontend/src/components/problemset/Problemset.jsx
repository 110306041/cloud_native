import React, { useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Chip from "@mui/material/Chip";
import { ToastContainer, toast } from "react-toastify";

const mockProblems = [
  { id: 1, name: "Binary Tree Traversal", difficulty: "Easy", score: 85 },
  {
    id: 2,
    name: "Depth First Search Implementation",
    difficulty: "Medium",
    score: 92,
  },
  {
    id: 3,
    name: "Dynamic Programming Challenge",
    difficulty: "Hard",
    score: 78,
  },
  { id: 4, name: "Stack Operations", difficulty: "Easy", score: 100 },
  { id: 5, name: "Graph Coloring Problem", difficulty: "Hard", score: 88 },
  { id: 6, name: "Breadth First Search", difficulty: "Medium", score: 95 },
  { id: 7, name: "Heap Sort Algorithm", difficulty: "Medium", score: 90 },
  {
    id: 8,
    name: "Binary Search Implementation",
    difficulty: "Easy",
    score: 100,
  },
  { id: 9, name: "Network Flow Problem", difficulty: "Hard", score: 82 },
  { id: 10, name: "Tree Balancing", difficulty: "Medium", score: 88 },
];

const columns = [
  { id: "id", label: "#", minWidth: 50, maxWidth: 70, align: "center" },
  { id: "name", label: "Problem Name", minWidth: 150, align: "left" },
  {
    id: "difficulty",
    label: "Difficulty",
    minWidth: 100,
    maxWidth: 120,
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

const mockProblemsetInfo = {
  courseInfo: {
    semester: "113-1",
    name: "Data Structures and Algorithms",
  },
  problemsetName: "Assignment 1",
  startDate: "2024-03-01T00:00:00",
  dueDate: "2024-03-15T23:59:59",
  problemType: "assignment",
};
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
  },
  infoLabel: {
    display: "block",
    marginBottom: "0.5rem",
  },
};
export default function ProblemSet() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="courses-container">
      <ToastContainer />
      <div className="courses-right">
        <h2 style={styles.assignmentTitle}>
          {mockProblemsetInfo.courseInfo.semester}{" "}
          {mockProblemsetInfo.courseInfo.name}
        </h2>
        <h2 style={styles.assignmentTitle}>
          {mockProblemsetInfo.problemsetName}
        </h2>

        <div style={styles.problemsetInfo}>
          <div style={styles.infoLabel}>
            <span>Start Date: {getDateTime(mockProblemsetInfo.startDate)}</span>
          </div>

          <span style={styles.infoLabel}>
            Due Date: {getDateTime(mockProblemsetInfo.dueDate)}
          </span>
        </div>

        <Paper
          sx={{
            width: "100%",
            height: "800px",
            borderRadius: "16px",
            overflow: "hidden",
            marginBottom: "40px",
            marginTop: "20px",
          }}
        >
          <TableContainer>
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
                {mockProblems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={index}
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
                            switch (value) {
                              case "Easy":
                                badgeColor = "#8ACB88";
                                break;
                              case "Hard":
                                badgeColor = "#FA7272";
                                break;
                              case "Medium":
                                badgeColor = "#5AB2FF";
                                break;
                              default:
                                badgeColor = "#D9D9D9";
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
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={mockProblems.length}
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
