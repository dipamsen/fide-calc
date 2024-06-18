import {
  Autocomplete,
  Box,
  Button,
  Container,
  Link,
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
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getData() {
      let url = "";
      if (import.meta.env.DEV) {
        url += "http://localhost:3000";
      }
      url += `/api/tournament?id=${tid}`;

      const response = await fetch(url);
      if (!response.ok) {
        setError(await response.text());
        return;
      }
      const data = await response.json();
      setData(data);
      console.log(data);
    }
    getData();
  }, []);

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px", flex: 1 }}>
      <Typography variant="h3">FIDE Rating Calculations</Typography>

      <Box sx={{ height: 10 }}></Box>

      <Link href="/">
        <Typography variant="body1">Back to home</Typography>
      </Link>

      <Box sx={{ height: 10 }}></Box>

      {data ? (
        <>
          <Typography variant="h4" sx={{ wordWrap: "break-word" }}>
            {data.title}
          </Typography>

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
      ) : error ? (
        <Box
          sx={{ marginTop: "20px" }}
          bgcolor={"red"}
          borderRadius={"10px"}
          padding={"20px"}
        >
          <Typography variant="h5" color={"black"} fontWeight={"bold"}>
            Error: {error}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1">Loading...</Typography>
      )}
    </Container>
  );
}

export default Tournament;
