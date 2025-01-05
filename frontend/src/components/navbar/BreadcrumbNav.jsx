import React, { useEffect, useState } from "react";
import { Breadcrumbs, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";

const BreadcrumbNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const handleClick = (e, breadcrumb) => {
    if (!breadcrumb.isLast && breadcrumb.link) {
      e.preventDefault();
      navigate(breadcrumb.link);
    }
  };

  useEffect(() => {
    const generateBreadcrumbs = () => {
      const pathnames = location.pathname.split("/").filter((x) => x);
      const items = [];

      // Always start with "Home"
      items.push({ name: "Home", link: "/", isLast: pathnames.length === 0 });

      // Custom breadcrumb logic for dynamic paths
      if (pathnames.includes("courses")) {
        items.push({ name: "Courses", link: "/courses", isLast: false });
      }

      if (pathnames.includes("course")) {
        items.push({
          name: `Course ${location.state?.courseId || ""}`,
          link: location.pathname,
          isLast: false,
        });
      }

      if (pathnames.includes("problemset")) {
        items.push({
          name: "Problem Set",
          link: location.pathname,
          isLast: pathnames[pathnames.length - 1] === "problemset",
        });
      }

      if (pathnames.includes("problem")) {
        items.push({
          name: "Problem",
          link: location.pathname,
          isLast: true,
        });
      }

      if (pathnames.includes("submissions")) {
        items.push({
          name: "Submissions",
          link: location.pathname,
          isLast: true,
        });
      }

      if (pathnames.includes("addCourse")) {
        items.push({
          name: "Add Course",
          link: location.pathname,
          isLast: true,
        });
      }

      if (pathnames.includes("addProblem")) {
        items.push({
          name: "Add Problem",
          link: location.pathname,
          isLast: true,
        });
      }

      setBreadcrumbs(items);
    };

    generateBreadcrumbs();
  }, [location]);

  const breadcrumbStyle = {
    padding: "12px 24px",
    backgroundColor: "#f9f9f9",
    borderBottom: "1px solid #ddd",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
        {breadcrumbs.map((breadcrumb, index) => {
          const content = (
            <>
              {index === 0 && <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />}
              {breadcrumb.name}
            </>
          );

          return (
            <Typography
              key={index}
              onClick={(e) => handleClick(e, breadcrumb)}
              style={{
                display: "flex",
                alignItems: "center",
                color: breadcrumb.isLast ? "#666" : "#445E93",
                textDecoration: breadcrumb.isLast ? "none" : "underline",
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
