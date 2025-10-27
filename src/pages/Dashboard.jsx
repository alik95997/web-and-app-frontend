import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

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

  const handleReAnalyze = async (reportId, fileUrl) => {
    setAiLoading(reportId);
    try {
      await API.post(
        "/ai/analyze",
        { fileId: reportId, fileUrl },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("✅ AI analysis completed!");
      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, aiGenerated: true } : r
        )
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
      <Container sx={{ mt: 5, mb: 5 }}>
        {/* Reports Section */}
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          Your Reports
        </Typography>

        <Grid container spacing={3}>
          {reports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.15)",
                  },
                  height: "100%",
                  backgroundColor: "#fff",
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {r.fileName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
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

        {/* Vitals Section */}
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 6, mb: 2 }}>
          Your Vitals
        </Typography>

        <Grid container spacing={3}>
          {vitals.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v._id}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
                  },
                  backgroundColor: "#f9f9f9",
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  {new Date(v.date).toLocaleDateString()}
                </Typography>
                <Typography>BP: {v.bp}</Typography>
                <Typography>Sugar: {v.sugar}</Typography>
                <Typography>Weight: {v.weight}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
