import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {
  Avatar,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import React, { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { Navigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BACK_SERVER_URL } from "../../config/config";

import { userType } from "../../utils";
import "./signUp.css";

const Copyright = () => {
  return (
    <Typography
      variant="body2"
      color="textSecondary"
      align="center"
      style={{ marginTop: "10px" }}
    >
      {"Copyright © "}
      Online Judge {new Date().getFullYear()}
      {"."}
    </Typography>
  );
};

const SignUp = () => {
  const [type, setType] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [signedUp, setSignedUp] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateEmail = (e) => {
    const emailreg =
      /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
    if (!e.target.value.match(emailreg))
      setEmailError("Please enter a valid email address!");
    else setEmailError("");
    setEmail(e.target.value);
  };

  const validatePassword = (e) => {
    const passwordreg = /^(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%#*?&]{8,}$/;
    if (!e.target.value.match(passwordreg))
      setPasswordError(
        "Use 8 or more characters with a mix of letters & numbers:)"
      );
    else setPasswordError("");
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${BACK_SERVER_URL}/api/auth/register`, {
        type,
        username,
        email,
        password,
      })
      .then((res) => {
        setSignedUp(true);
      })
      .catch((err) => {
        setLoading(false);
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
  };

  if (signedUp) return <Navigate to="/signin" />;

  return (
    <Grid align="center" className="signup-container">
      <ToastContainer />
      <Paper className="signup-paper">
        <Grid align="center">
          <Avatar className="signup-avatar">
            <AddCircleOutlineOutlinedIcon />
          </Avatar>
          <h2 className="signup-title">Sign Up</h2>
        </Grid>
        <form onSubmit={handleSubmit}>
          <select
            required
            id="type"
            name="type"
            value={type}
            onChange={(event) => {
              setType(event.target.value);
            }}
            style={{
              width: "100%",
              height: "55px",
              fontSize: "15px",
              marginBottom: "10px",
              paddingLeft: "10px",
              borderRadius: "5px",
              border: "1px solid #5f8397",
              color: type ? "#000000" : "#5f8397", // 選擇完後變黑色
            }}
          >
            <option value="" disabled style={{ color: "#5f8397" }}>
              Select Your Role
            </option>
            {userType.map((role, index) => {
              return (
                <option key={index} value={role.toLowerCase()}>
                  {role}
                </option>
              );
            })}
          </select>

          <TextField
            fullWidth
            id="username"
            label="Username"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#5f8397", // 邊框顏色
                },
                "&:hover fieldset": {
                  borderColor: "#3b6b82", // 滑鼠懸停時的顏色
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1b4b62", // 聚焦時的顏色
                },
              },
              "& .MuiInputLabel-root": {
                color: "#5f8397", // 標籤顏色
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1b4b62", // 聚焦時的標籤顏色
              },
            }}
          />
          <TextField
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            helperText={emailError}
            onChange={(e) => validateEmail(e)}
            error={emailError.length > 0}
            style={{ marginBottom: "10px" }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#5f8397", // 邊框顏色
                },
                "&:hover fieldset": {
                  borderColor: "#3b6b82", // 滑鼠懸停時的顏色
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1b4b62", // 聚焦時的顏色
                },
              },
              "& .MuiInputLabel-root": {
                color: "#5f8397", // 標籤顏色
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1b4b62", // 聚焦時的標籤顏色
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            placeholder="Enter your password"
            name="password"
            type="password"
            id="password"
            value={password}
            helperText={passwordError}
            onChange={(e) => validatePassword(e)}
            error={passwordError.length > 0}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "#5f8397", // 邊框顏色
                },
                "&:hover fieldset": {
                  borderColor: "#3b6b82", // 滑鼠懸停時的顏色
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1b4b62", // 聚焦時的顏色
                },
              },
              "& .MuiInputLabel-root": {
                color: "#5f8397", // 標籤顏色
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#1b4b62", // 聚焦時的標籤顏色
              },
            }}
          />
          <FormControlLabel
            style={{ marginTop: "20px" }}
            control={
              <Checkbox
                name="checkedA"
                sx={{
                  color: "#5f8397",
                  "&.Mui-checked": {
                    color: "#3b6b82", // 勾選後的顏色
                  },
                }}
              />
            }
            label="I accept the terms and conditions."
          />
          <div style={{ marginTop: "10px" }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                marginTop: "10px",
                backgroundColor: "#5f8397", // 按鈕背景色
                color: "white", // 字體顏色
              }}
              sx={{
                "&:hover": {
                  backgroundColor: "#3b6b82", // 滑鼠懸停時的背景色
                },
              }}
              fullWidth
            >
              {loading ? (
                <CircularProgress size={"23px"} style={{ color: "white" }} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
      </Paper>
    </Grid>
  );
};

export default SignUp;
