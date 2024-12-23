import {
  Box,
  Container,
  TextField,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useState } from "react";
import { getDP } from "./utils/p-dp";

function App() {
  const [rtgAvg, setRtgAvg] = useState(0);
  const [numRated, setNumRated] = useState(0);
  const [score, setScore] = useState(0);

  const onMobile = useMediaQuery("(max-width: 600px)");

  const Ra = (rtgAvg * numRated + 1800 + 1800) / (numRated + 2);
  const dp = getDP((score + 1) / (numRated + 2));
  const Ru = Ra + dp;

  const error =
    numRated < 5
      ? "Minimum 5 rated games required"
      : rtgAvg < 1400
      ? "Rating Average should be greater than 1400"
      : "";

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px", flex: 1 }}>
      <Typography variant="h3">FIDE Rating Calculator</Typography>

      <Box sx={{ height: 20 }}></Box>

      <Typography variant="body1">
        Calculator for FIDE Rating Calculations for Chess Tournaments.
      </Typography>
      <Box sx={{ height: 20 }}></Box>

      {/* Initial Rating */}
      <Typography variant="h6">Initial Rating Calculator</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: onMobile ? "column" : "row",
          gap: onMobile ? 0 : "1em",
        }}
      >
        {/* <FormControl fullWidth> */}
        {/* enter tournament id/link */}
        <TextField
          label="Rating Average of players"
          variant="outlined"
          margin="normal"
          type="number"
          value={rtgAvg}
          onChange={(e) => setRtgAvg(+e.target.value)}
          fullWidth
        />
        <TextField
          label="Number of Rated Games"
          variant="outlined"
          margin="normal"
          type="number"
          value={numRated}
          onChange={(e) => setNumRated(+e.target.value)}
          fullWidth
        />
        <TextField
          label="Score"
          variant="outlined"
          margin="normal"
          type="number"
          value={score}
          onChange={(e) => setScore(+e.target.value)}
          fullWidth
        />
      </Box>

      <Box sx={{ height: 20 }}></Box>

      {error === "" ? (
        <>
          <Typography variant="h6">Initial Rating:</Typography>
          <Typography variant="body1">{Ru.toFixed(0)}</Typography>
        </>
      ) : (
        <>
          <Typography variant="body1">{error}</Typography>
        </>
      )}
    </Container>
  );
}

export default App;
