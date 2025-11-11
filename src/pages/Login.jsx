import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Email, Lock } from "@mui/icons-material";
import API from "../api/axiosConfig";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 8 }}>
      <Paper
        sx={{
          display: "flex",
          borderRadius: 4,
          overflow: "hidden",
          minHeight: 500,
          boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
        }}
      >
        {/* Left Branding Side */}
        <Box
          sx={{
            flex: 1,
            background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 6,
            textAlign: "center",
          }}
        >
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            HealthMate
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 300 }}>
            Welcome back! Login to access your health dashboard, view reports,
            and track your vitals.
          </Typography>
          <Box
            sx={{
              mt: 4,
              width: 50,
              height: 4,
              backgroundColor: "#fff",
              borderRadius: 2,
            }}
          />
        </Box>

        {/* Right Login Form */}
        <Box sx={{ flex: 1, p: 6, display: "flex", flexDirection: "column" }}>
          <Typography variant="h4" fontWeight="bold" mb={3}>
            Login
          </Typography>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              fullWidth
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      size="small"
                      sx={{ color: "gray" }}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 2,
                py: 1.5,
                fontWeight: 600,
                borderRadius: 3,
                background: "linear-gradient(135deg, #4caf50 0%, #81c784 100%)",
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #43a047 0%, #66bb6a 100%)",
                },
              }}
            >
              Login
            </Button>
          </form>

          <Typography mt={3} align="center" variant="body2">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              style={{
                textDecoration: "none",
                color: "#4caf50",
                fontWeight: 600,
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
