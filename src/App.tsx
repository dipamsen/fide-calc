import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useState } from "react";

function App() {
  const [tournamentId, setTournamentId] = useState<string>();

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
          label="Tournament ID"
          variant="outlined"
          margin="normal"
          fullWidth
          value={tournamentId}
          onChange={(e) => setTournamentId(e.target.value)}
        />
        <Button
          variant="contained"
          color="primary"
          href={`/swiss/${tournamentId}`}
        >
          Go
        </Button>
        {/* </FormControl> */}
      </Box>
    </Container>
  );
}

export default App;
