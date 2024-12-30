import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../authContext";
import { NavLink } from "react-router-dom";

import "./navbar.css";

export default function NavBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options = ["Logout"]; // 移除空選項

  const appContext = useContext(AuthContext);
  const { login, setLogin } = appContext;
  const isCourseRelated = (path) => {
    return ["/courses", "/course", "/problemset", "/problem"].some((route) =>
      path.startsWith(route)
    );
  };
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
    if (options[index] === "View Profile") window.location = "/dashboard";
    else {
      localStorage.removeItem("login");
      localStorage.removeItem("access-token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      setLogin(false);
      window.location = "/";
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="navbar">
      <div className="navbarWrapper">
        <div className="navLeft">
          <Link to="/" className="logo">
            NCCU MIS OJ
          </Link>
          <div className="navbarList">
            {login && (
              <>
                <NavLink
                  to="/courses"
                  className={({ isActive }) =>
                    isActive || isCourseRelated(window.location.pathname)
                      ? "navbarItem active"
                      : "navbarItem"
                  }
                >
                  Courses
                </NavLink>
                {localStorage.getItem("role") === "student" && (
                  <NavLink
                    to="/submissions"
                    className={({ isActive }) =>
                      isActive ? "navbarItem active" : "navbarItem"
                    }
                  >
                    Submissions
                  </NavLink>
                )}
              </>
            )}
          </div>
        </div>
        <div className="navRight">
          {login ? (
            <>
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <Button
                  aria-controls="simple-menu"
                  aria-haspopup="true"
                  onClick={handleClickListItem}
                  style={{ padding: 0 }}
                >
                  <div>
                    {localStorage.getItem("role") === "student" ? (
                      <img
                        src="/images/avatar.jpg" // 學生角色的圖片
                        alt="Student Avatar"
                        className="navbarAvatar"
                      />
                    ) : localStorage.getItem("role") === "teacher" ? (
                      <img
                        src="/images/tAvatar.jpg" // 教師角色的圖片
                        alt="Teacher Avatar"
                        className="navbarAvatar"
                      />
                    ) : null}
                  </div>
                </Button>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: 0,
                    margin: 0,
                  }}
                >
                  <span
                    style={{
                      color: "#F8F8F8",
                      fontSize: "16px",
                      lineHeight: "1", // 減小行距
                      marginBottom: "6px", // 控制下方間距
                    }}
                  >
                    {localStorage.getItem("username")}
                  </span>
                  <span
                    style={{
                      color: "#F8F8F8",
                      fontSize: "16px",
                      lineHeight: "1",
                    }}
                  >
                    {localStorage.getItem("role")}
                  </span>
                </div>
              </div>
              <Menu
                id="simple-menu"
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  "& .MuiPaper-root": {
                    backgroundColor: "#333",
                    color: "#f8f8f8",
                    minWidth: "90px",
                    marginTop: "12px",
                  },
                  "& .MuiMenuItem-root": {
                    fontSize: "16px",
                    justifyContent: "center", // 文字置中
                    "&:hover": {
                      backgroundColor: "#444",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#555",
                      "&:hover": {
                        backgroundColor: "#666",
                      },
                    },
                  },
                }}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    onClick={(event) => handleMenuItemClick(event, index)}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </>
          ) : (
            <Link to="/signin" style={{ textDecoration: "none" }}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                className="signin-btn"
                sx={{
                  backgroundColor: "#445E93",
                  fontWeight: "bold",
                  "&:hover": {
                    backgroundColor: "#29335C",
                  },
                }}
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
