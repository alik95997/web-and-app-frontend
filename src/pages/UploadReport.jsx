import React, { useState } from "react";
import { Button, Container, Paper, Typography, Box, CircularProgress } from "@mui/material";
import API from "../api/axiosConfig";

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);
    setPreview(selected?.type.startsWith("image/") ? URL.createObjectURL(selected) : null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Select a file");

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("File uploaded! URL: " + res.data.fileUrl);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h6">Upload Report</Typography>
        <input type="file" accept="application/pdf,image/*" onChange={handleFileChange} />

        {preview && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">Preview:</Typography>
            <img src={preview} alt="preview" style={{ maxWidth: "100%", maxHeight: 200 }} />
          </Box>
        )}

        {file?.type === "application/pdf" && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2">PDF selected:</Typography>
            <a href={URL.createObjectURL(file)} target="_blank" rel="noreferrer">{file.name}</a>
          </Box>
        )}

        <Button variant="contained" sx={{ mt: 3 }} onClick={handleUpload} disabled={loading}>
          {loading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      </Paper>
    </Container>
  );
}
