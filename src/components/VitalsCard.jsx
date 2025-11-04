import React from "react";
import { Paper, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

/**
 * VitalsCard
 * Props:
 *  - vitals: { _id, date, bp, sugar, weight, notes }
 *  - onEdit (optional): function(vitals)
 *  - onDelete (optional): function(id)
 */
export default function VitalsCard({ vitals, onEdit, onDelete }) {
  if (!vitals) return null;

  return (
    <Paper sx={{ p: 2, height: "100%", position: "relative" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {new Date(vitals.date).toLocaleDateString()}
          </Typography>
          <Typography>BP: {vitals.bp || "-"}</Typography>
          <Typography>Sugar: {vitals.sugar || "-"}</Typography>
          <Typography>Weight: {vitals.weight || "-"}</Typography>
          {vitals.notes && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, whiteSpace: "pre-line" }}
            >
              {vitals.notes}
            </Typography>
          )}
        </Box>

        <Box>
          {typeof onEdit === "function" && (
            <IconButton size="small" onClick={() => onEdit(vitals)}>
              <EditIcon fontSize="small" />
            </IconButton>
          )}
          {typeof onDelete === "function" && (
            <IconButton size="small" onClick={() => onDelete(vitals._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
