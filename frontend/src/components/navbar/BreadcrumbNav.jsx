import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

const BreadcrumbNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [clickedIndex, setClickedIndex] = useState(null);

  const handleClick = (e, index, isLast) => {
    if (!isLast) {
      e.preventDefault();
      setClickedIndex(index);
      navigate(-1);
    }
  };

  useEffect(() => {
    const generateBreadcrumbs = () => {
      const pathnames = location.pathname.split("/").filter((x) => x);
      let items = [];

      if (!["/signin", "/signup"].includes(location.pathname)) {
        items.push({ name: "Courses", isLast: false });
      }

      if (pathnames[0] === "submissions") {
        const hasAssignment = location.state?.fromAssignment;

        if (hasAssignment) {
          items.push({ name: "Assignments & Exams", isLast: false });
          items.push({ name: "Problem Set", isLast: false });
          items.push({ name: "Problem", isLast: false });
        }

        items.push({ name: "Submissions", isLast: true });
        return items;
      }

      if (["course", "problemset", "problem"].includes(pathnames[0])) {
        if (!["addHw", "addExam"].includes(pathnames[0])) {
          items.push({
            name: "Assignments & Exams",
            isLast: pathnames[0] === "course",
          });
        }

        if (["problemset", "problem"].includes(pathnames[0])) {
          items.push({
            name: "Problem Set",
            isLast: pathnames[0] === "problemset",
          });
        }

        if (pathnames[0] === "problem") {
          items.push({
            name: "Problem",
            isLast: true,
          });
        }
      }

      if (["addHw", "addExam"].includes(pathnames[0])) {
        items.push({
          name: "Assignments & Exams",
          isLast: false,
        });

        items.push({
          name: pathnames[0] === "addHw" ? "Add Assignment" : "Add Exam",
          isLast: true,
        });
      }

      if (pathnames[0] === "addProblem") {
        items.push({
          name: "Assignments & Exams",
          isLast: false,
        });
        items.push({
          name: "Problem Set",
          isLast: false,
        });
        items.push({
          name: "Add Problem",
          isLast: true,
        });
      }

      if (pathnames[0] === "addCourse") {
        items.push({
          name: "Add Course",
          isLast: true,
        });
      }

      setBreadcrumbs(items);
    };

    generateBreadcrumbs();
  }, [location]);

  const breadcrumbStyle = {
    padding: "12px 24px",
    backgroundColor: "#fff",
    borderBottom: "1px solid #e0e0e0",
    boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
  };

  if (["/signin", "/signup"].includes(location.pathname)) {
    return null;
  }

  return (
    <div style={breadcrumbStyle}>
      <Breadcrumbs
        separator={<NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        {breadcrumbs
          .slice(0, clickedIndex !== null ? clickedIndex + 1 : undefined)
          .map((breadcrumb, index) => {
            const content = (
              <>
                {index === 0 && (
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                )}
                {breadcrumb.name}
              </>
            );

            return (
              <Typography
                key={index}
                onClick={(e) => handleClick(e, index, breadcrumb.isLast)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  color:
                    breadcrumb.name === "Courses" || !breadcrumb.isLast
                      ? "#445E93"
                      : "#666",
                  textDecoration: "none",
                  cursor: breadcrumb.isLast ? "default" : "pointer",
                }}
              >
                {content}
              </Typography>
            );
          })}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbNav;
