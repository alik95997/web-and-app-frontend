import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig.js";
import Navbar from "../components/Navbar";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  CircularProgress,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VitalsCard from "../components/VitalsCard";
import DeleteIcon from "@mui/icons-material/Delete";
import AssessmentIcon from "@mui/icons-material/Assessment";
import FavoriteIcon from "@mui/icons-material/Favorite";
import axios from "axios";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res1 = await API.get("/files");
        const res2 = await API.get("/vitals");
        setReports(res1.data);
        setVitals(res2.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const onDelete = async (id) => {
    if (!window.confirm("🩺 Are you sure you want to delete this vital?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/vitals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVitals((prev) => prev.filter((v) => v._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete vital");
    }
  };

  const deleteReport = async (id) => {
    if (!window.confirm("🧾 Are you sure you want to delete this report?")) return;
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/files/deletereport/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  const handleReAnalyze = async (reportId, fileUrl) => {
    setAiLoading(reportId);
    try {
      await API.post(
        "/ai/analyze",
        { fileId: reportId, fileUrl },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      alert("✅ AI analysis completed!");
      setReports((prev) =>
        prev.map((r) => (r._id === reportId ? { ...r, aiGenerated: true } : r))
      );
    } catch (err) {
      console.error(err);
      alert("AI analysis failed.");
    } finally {
      setAiLoading(null);
    }
  };

  if (loading)
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" mt={12}>
          <CircularProgress />
        </Box>
      </>
    );

  return (
    <>
      <Navbar />
      <Container sx={{ mt: 6, mb: 6 }}>
        {/* 🧾 Reports Section */}
        <Box display="flex" alignItems="center" mb={2}>
          <AssessmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Your Reports
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {reports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Paper
                sx={{
                  position: "relative",
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <Tooltip title="Delete Report">
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => deleteReport(r._id)}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      opacity: 0.7,
                      "&:hover": { opacity: 1, transform: "scale(1.1)" },
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>

                <Box>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {r.fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {r.fileType}
                  </Typography>

                  <Box mt={1} display="flex" alignItems="center" gap={1}>
                    {r.aiGenerated ? (
                      <Chip label="AI Done" color="success" size="small" />
                    ) : (
                      <Chip label="Pending" color="warning" size="small" />
                    )}
                    <Button
                      size="small"
                      href={r.fileUrl}
                      target="_blank"
                      sx={{ ml: "auto" }}
                    >
                      View File
                    </Button>
                  </Box>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {!r.aiGenerated ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      fullWidth
                      onClick={() => handleReAnalyze(r._id, r.fileUrl)}
                      disabled={aiLoading === r._id}
                    >
                      {aiLoading === r._id ? (
                        <CircularProgress size={20} />
                      ) : (
                        "Run AI"
                      )}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      fullWidth
                      onClick={() => navigate(`/view/${r._id}`)}
                    >
                      View Summary
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ❤️ Vitals Section */}
        <Box display="flex" alignItems="center" sx={{ mt: 7, mb: 2 }}>
          <FavoriteIcon color="error" sx={{ mr: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Your Vitals
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {vitals.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                  },
                  backgroundColor: "#fdfdfd",
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="start">
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      {new Date(v.date).toLocaleDateString()}
                    </Typography>
                    <Typography>BP: {v.bp}</Typography>
                    <Typography>Sugar: {v.sugar}</Typography>
                    <Typography>Weight: {v.weight}</Typography>
                  </Box>

                  <Tooltip title="Delete Vital">
                    <IconButton
                      size="small"
                      onClick={() => onDelete(v._id)}
                      sx={{
                        color: "error.main",
                        opacity: 0.7,
                        "&:hover": { opacity: 1, transform: "scale(1.1)" },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
