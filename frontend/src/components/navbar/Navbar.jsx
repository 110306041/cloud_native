import { Button } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../authContext";

import "./navbar.css";

export default function NavBar(props) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options = ["", "Logout"];

  const appContext = useContext(AuthContext);
  const { login, setLogin } = appContext;

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
            {login ? ( //TODO: decide which tab should show through tab
              <>
                <Link to="/courses" className="navbarItem">
                  Courses
                </Link>
                <Link to="/addproblem" className="navbarItem">
                  Problems
                </Link>
                <Link to="/submissions" className="navbarItem">
                  Submissions
                </Link>
              </>
            ) : null}
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
                  <img
                    src="/images/avatar.jpg"
                    alt="avatar"
                    className="navbarAvatar"
                  />
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
                    {"username"}
                  </span>
                  <span
                    style={{
                      color: "#F8F8F8",
                      fontSize: "16px",
                      lineHeight: "1",
                    }}
                  >
                    {"identity"}
                  </span>
                </div>
              </div>
              <Menu
                id="simple-menu"
                keepMounted
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                {options.map((option, index) => (
                  <MenuItem
                    key={option}
                    disabled={index === 0}
                    selected={index === selectedIndex}
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
                  backgroundColor: "#5F8397",
                  "&:hover": {
                    backgroundColor: "#3b6b82",
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
