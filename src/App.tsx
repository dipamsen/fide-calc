import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./index.css";

function App() {
  const [url, setUrl] = useState<string>();

  function handle(value: string) {
    if (value.includes("chess-results.com")) {
      const url = new URL(value);
      const id = url.pathname.split(".")[0].slice(1);
      return id;
    }
    return value;
  }

  const tournamentId = handle(url ?? "");
  console.log(tournamentId);

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px", flex: 1 }}>
      <Typography variant="h3">FIDE Rating Calculations</Typography>

      <Box sx={{ height: 20 }}></Box>

      <Typography variant="body1">
        Tool for FIDE Rating Calculations for Chess Tournaments via
        chess-results.org
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {/* <FormControl fullWidth> */}
        {/* enter tournament id/link */}
        <TextField
          label="Tournament ID/URL"
          variant="outlined"
          margin="normal"
          fullWidth
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          href={`/swiss/${tournamentId}`}
        >
          Go
        </Button>

        <Box sx={{ height: 20 }}></Box>

        <Typography variant="body2">
          Check out the Initial Rating Calculator <Link to="/calc">here</Link>.
        </Typography>
        {/* </FormControl> */}
      </Box>
    </Container>
  );
}

export default App;
