import React, { useState } from "react";
import { TextField, Button, Container, Paper, Typography } from "@mui/material";
import Navbar from "../components/Navbar";
import API from "../api/axiosConfig  ";

export default function AddVitals() {
  const [vitals, setVitals] = useState({ bp: "", sugar: "", weight: "", notes: "" });

  const handleChange = (e) => setVitals({ ...vitals, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    await API.post("/vitals/add", vitals);
    alert("Vitals added successfully!");
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add Manual Vitals
          </Typography>
          <TextField label="Blood Pressure" name="bp" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Sugar" name="sugar" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Weight" name="weight" fullWidth margin="normal" onChange={handleChange} />
          <TextField label="Notes" name="notes" fullWidth margin="normal" onChange={handleChange} />
          <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handleSubmit}>
            Save
          </Button>
        </Paper>
      </Container>
    </>
  );
}
