import {
  Autocomplete,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Tournament() {
  const { tid } = useParams();
  const [data, setData] = useState<{
    title: string;
    players: {
      name: string;
      points: number;
      rank: number;
      rating: number;
      link: string;
      id: number;
    }[];
  }>();
  const [player, setPlayer] = useState<number>();

  useEffect(() => {
    async function getData() {
      let url = "";
      if (import.meta.env.DEV) {
        url += "http://localhost:3000";
      }
      url += `/api/tournament?id=${tid}`;

      const response = await fetch(url);
      const data = await response.json();
      setData(data);
      console.log(data);
    }
    getData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px", flex: 1 }}>
      <Typography variant="h3">FIDE Rating Calculations</Typography>

      <Box sx={{ height: 20 }}></Box>

      {data ? (
        <>
          <Typography variant="h4">{data.title}</Typography>

          {/* input box to enter name of player with rich autocompletion/dropdown */}
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Autocomplete
              options={data.players}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.id.toString()}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <span
                    style={{
                      width: "40px",
                      textAlign: "right",
                      marginRight: "5px",
                    }}
                  >
                    {option.rank}.
                  </span>
                  {option.name} (
                  {option.rating == 0 ? "Unrated" : option.rating})
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Player..."
                  variant="outlined"
                  margin="normal"
                  fullWidth
                />
              )}
              value={data.players.find((p) => p.id == player)}
              onChange={(_e, val) => setPlayer(val?.id)}
            ></Autocomplete>

            <Button
              variant="contained"
              color="primary"
              href={`/swiss/${tid}/player/${player}`}
            >
              GO
            </Button>
          </Box>
        </>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Container>
  );
}

export default Tournament;
