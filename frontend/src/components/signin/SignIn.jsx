import {
    Avatar,
    Button,
    Grid,
    Link,
    Paper,
    TextField,
    Typography,
} from "@mui/material";
import React, { useContext, useState } from "react";
import { Navigate } from "react-router";
  
  import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AuthContext } from "../../authContext";
import { BACK_SERVER_URL } from "../../config/config";
  
  import "./signIn.css";
  
  const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
  
    const appContext = useContext(AuthContext);
    const { login, setLogin } = appContext;
  
    const handleSignIn = (e) => {
      e.preventDefault();
      setLoading(true);
      
      axios
        .post(`${BACK_SERVER_URL}/api/auth/login`, {
          email,
          password,
        })
        .then((res) => {
          localStorage.setItem("access-token", res.data.accessToken);
          localStorage.setItem("login", true);
          localStorage.setItem("role", res.data.user.role);
          setLogin(true);
        })
        .catch((err) => {
          setLoading(false);
          const error = "Invalid Username or Password!";
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
  
    if (login) return <Navigate to="/" />;
  
    return (
      <Grid align="center" className="signin-container">
        <ToastContainer />
        <Paper className="signin-paper">
          <Grid align="center">
            <Avatar className="signin-avatar">
              <LockOutlinedIcon />
            </Avatar>
            <h2 className="signin-title">Sign In</h2>
          </Grid>
          <TextField
            label="Email"
            placeholder="Enter your email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            fullWidth
            required
            style={{marginBottom: "10px"}}
          />
          <TextField
            label="Password"
            placeholder="Enter your password"
            type="password"
            name="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            type="submit"
            color="primary"
            variant="contained"
            className="signin-btn"
            onClick={handleSignIn}
            fullWidth
          >
            {loading ? (
              <CircularProgress size={"23px"} style={{ color: "white" }} />
            ) : (
              "Sign In"
            )}
          </Button>
          <Typography>
            Do you have an account?
            <Link href="/signup" style={{ margin: "5px", cursor: "pointer" }}>
              Sign Up
            </Link>
          </Typography>
        </Paper>
      </Grid>
    );
  };
  
  export default SignIn;