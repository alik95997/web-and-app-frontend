import React, { useState } from "react";
import {
  Button,
  Container,
  Paper,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import API from "../api/axiosConfig";
import Navbar from "../components/Navbar";

export default function UploadReport() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(
      selected.type.startsWith("image/") ? URL.createObjectURL(selected) : null
    );
    setUploadedUrl(null);
    setSuccess(false);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file first");

    setLoading(true);
    setSuccess(false);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUploadedUrl(res.data.url);
      setSuccess(true);
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            mt: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" gutterBottom>
            Upload Medical Report
          </Typography>

          <input
            type="file"
            accept="application/pdf,image/*"
            onChange={handleFileChange}
            style={{ marginTop: "10px" }}
          />

          {preview && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Preview:
              </Typography>
              <img
                src={preview}
                alt="preview"
                style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
              />
            </Box>
          )}

          {file?.type === "application/pdf" && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">PDF Selected:</Typography>
              <a
                href={URL.createObjectURL(file)}
                target="_blank"
                rel="noreferrer"
              >
                {file.name}
              </a>
            </Box>
          )}

          <Button
            variant="contained"
            sx={{ mt: 3, px: 4 }}
            onClick={handleUpload}
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Upload"
            )}
          </Button>

          {success && (
            <Alert severity="success" sx={{ mt: 3 }}>
              ✅ File uploaded successfully! Go to Dashboard to View Report
            </Alert>
          )}

          {uploadedUrl && (
            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="subtitle2" gutterBottom>
                Uploaded File:
              </Typography>
              {uploadedUrl.endsWith(".pdf") ? (
                <a href={uploadedUrl} target="_blank" rel="noreferrer">
                  View PDF
                </a>
              ) : (
                <img
                  src={uploadedUrl}
                  alt="uploaded"
                  style={{ maxWidth: "100%", maxHeight: 200, borderRadius: 8 }}
                />
              )}
            </Box>
          )}
        </Paper>
      </Container>
    </>
  );
}
