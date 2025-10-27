import React from "react";
import { Paper, Typography, Box, Button, Chip } from "@mui/material";
import { Link } from "react-router-dom";

/**
 * ReportCard
 * Props:
 *  - report: { _id, fileName, fileType, fileUrl, uploadedAt, aiGenerated }
 *  - onAnalyzeClick (optional): function to re-trigger analysis
 */
export default function ReportCard({ report, onAnalyzeClick }) {
  if (!report) return null;

  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderRadius: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-5px)",
          boxShadow: "0 6px 25px rgba(0,0,0,0.12)",
        },
        backgroundColor: "#fff",
      }}
    >
      {/* Report Info */}
      <Box>
        <Typography variant="subtitle1" fontWeight={600}>
          {report.fileName}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {report.fileType} • {new Date(report.uploadedAt).toLocaleDateString()}
        </Typography>

        <Typography variant="body2" sx={{ wordBreak: "break-all", mb: 1 }}>
          <a href={report.fileUrl} target="_blank" rel="noreferrer">
            Open File
          </a>
        </Typography>

        {/* AI Status Badge */}
        <Chip
          label={report.aiGenerated ? "AI Done" : "Pending"}
          color={report.aiGenerated ? "success" : "warning"}
          size="small"
        />
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
        {report.aiGenerated ? (
          <Button
            component={Link}
            to={`/view/${report._id}`}
            variant="contained"
            color="success"
            fullWidth
          >
            View Summary
          </Button>
        ) : (
          typeof onAnalyzeClick === "function" && (
            <Button
              onClick={() => onAnalyzeClick(report)}
              variant="outlined"
              color="primary"
              fullWidth
            >
              Run AI
            </Button>
          )
        )}
      </Box>
    </Paper>
  );
}
