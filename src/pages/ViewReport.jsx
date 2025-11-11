import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../api/axiosConfig.js";
import {
  Container,
  Typography,
  Paper,
  Button,
  Box,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  Article,
  QuestionAnswer,
  Restaurant,
  Healing,
} from "@mui/icons-material";

export default function ViewReport() {
  const { fileId } = useParams();
  const [report, setReport] = useState(null);
  const [summary, setSummary] = useState(null);
  const [showUrdu, setShowUrdu] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      if (!fileId) {
        setError("Report ID is missing!");
        setLoading(false);
        return;
      }

      try {
        const res1 = await API.get(`/files`);
        const files = res1.data.files || res1.data;

        const selected = files.find((r) => String(r._id) === String(fileId));
        if (!selected) {
          setError("Report not found.");
          setLoading(false);
          return;
        }

        setReport(selected);

        const res2 = await API.get(`/ai/${fileId}`);
        setSummary(res2.data);
      } catch (err) {
        console.error("Error fetching report or summary:", err);
        setError("Failed to fetch report or summary.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [fileId]);

  if (loading)
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" mt={12}>
          <CircularProgress />
        </Box>
      </>
    );

  if (error)
    return (
      <>
        <Navbar />
        <Box display="flex" justifyContent="center" mt={12}>
          <Typography color="error" variant="h6">
            {error}
          </Typography>
        </Box>
      </>
    );

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
        <Paper
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            backgroundColor: "#fafafa",
          }}
        >
          {/* Report Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {report.fileName}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              href={report.fileUrl}
              target="_blank"
            >
              <Article sx={{ mr: 1 }} /> View Original
            </Button>
          </Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Uploaded on {new Date(report.uploadedAt).toLocaleDateString()}
          </Typography>

          <Divider sx={{ my: 3 }} />

          {/* Summary Section */}
          {summary ? (
            <Box>
              <Button
                variant="outlined"
                onClick={() => setShowUrdu(!showUrdu)}
                sx={{ mb: 3 }}
              >
                {showUrdu
                  ? "Show English Summary"
                  : "Show Roman Urdu Summary"}
              </Button>

              <Paper
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-3px)" },
                }}
              >
                <Typography
                  variant="body1"
                  sx={{ whiteSpace: "pre-line", lineHeight: 1.6 }}
                >
                  {showUrdu
                    ? summary.summaryUrdu || "No Urdu summary available."
                    : summary.summaryEnglish || "No English summary available."}
                </Typography>
              </Paper>

              {/* Doctor Questions */}
              {summary.doctorQuestions?.length > 0 && (
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "#e8f5e9",
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    <QuestionAnswer sx={{ mr: 1, verticalAlign: "middle" }} />
                    Doctor Questions
                  </Typography>
                  {summary.doctorQuestions.map((q, i) => (
                    <Typography key={i} sx={{ pl: 2 }}>
                      • {q}
                    </Typography>
                  ))}
                </Paper>
              )}

              {/* Food Advice */}
              {summary.foodAdvice && (
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "#fff3e0",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    <Restaurant sx={{ mr: 1, verticalAlign: "middle" }} />
                    Food Advice
                  </Typography>
                  <Typography sx={{ pl: 2 }}>{summary.foodAdvice}</Typography>
                </Paper>
              )}

              {/* Home Remedies */}
              {summary.remedies && (
                <Paper
                  sx={{
                    p: 3,
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "#e1f5fe",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Typography variant="subtitle1" fontWeight="bold">
                    <Healing sx={{ mr: 1, verticalAlign: "middle" }} />
                    Home Remedies
                  </Typography>
                  <Typography sx={{ pl: 2 }}>{summary.remedies}</Typography>
                </Paper>
              )}
            </Box>
          ) : (
            <Typography sx={{ mt: 2, color: "text.secondary" }}>
              Summary not available yet. Please try again later.
            </Typography>
          )}
        </Paper>
      </Container>
    </>
  );
}
