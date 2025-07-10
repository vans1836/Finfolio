import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Paper,
  Snackbar,
  Alert,
  useTheme
} from "@mui/material";
import { tokens } from "../theme";

export default function Support() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    setOpen(true);
    setQuery("");
  };

  return (
    <Box sx={{ bgcolor: colors.primary[900], color: colors.grey[100], minHeight: "100vh", py: 6 }}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, backgroundColor: colors.primary[700], borderRadius: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Contact Support
          </Typography>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Have a question or need help? Drop us a message below.
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="Your Message"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            sx={{ mb: 2, backgroundColor: theme.palette.background.paper }}
          />
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: colors.greenAccent[600] }}>
            Send
          </Button>
        </Paper>
        <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)}>
          <Alert severity="success" sx={{ width: "100%" }}>
            Message sent successfully!
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}
