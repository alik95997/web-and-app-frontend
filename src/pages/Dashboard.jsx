import React, { useEffect, useState } from "react";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import { Container, Typography, Grid, Paper } from "@mui/material";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await API.get("/files");
      const res2 = await API.get("/vitals");
      setReports(res1.data);
      setVitals(res2.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <Navbar />
      <Container>
        <Typography variant="h5" gutterBottom>
          Your Reports
        </Typography>
        <Grid container spacing={2}>
          {reports.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="subtitle1">{r.fileName}</Typography>
                <Typography variant="body2">{r.fileType}</Typography>
                <a href={r.fileUrl} target="_blank" rel="noreferrer">
                  View File
                </a>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mt: 4 }} gutterBottom>
          Your Vitals
        </Typography>
        <Grid container spacing={2}>
          {vitals.map((v) => (
            <Grid item xs={12} sm={6} md={4} key={v._id}>
              <Paper sx={{ p: 2 }}>
                <Typography>BP: {v.bp}</Typography>
                <Typography>Sugar: {v.sugar}</Typography>
                <Typography>Weight: {v.weight}</Typography>
                <Typography>Date: {new Date(v.date).toLocaleDateString()}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
}
