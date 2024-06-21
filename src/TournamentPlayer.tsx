import {
  Box,
  Container,
  FormControl,
  IconButton,
  Link,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import InfoIcon from "@mui/icons-material/Info";
import { getDP } from "./utils/p-dp";
import { getPD } from "./utils/d-pd";

interface PlayerData {
  playerInfo: {
    name: string;
    rating: number;
    fideId: string;
    points: number;
    totalRounds: number;
    tournament: string;
  };
  games: {
    round: number;
    opponent: string;
    rating: number;
    result: number;
  }[];
}

function Calculations({ data }: { data: PlayerData }) {
  const [unratedModal, setUnratedModal] = useState(false);
  const [ratedModal, setRatedModal] = useState(false);
  const [kValue, setKValue] = useState(40);
  const [searchParams] = useSearchParams();

  let useRating = searchParams.get("useRating");

  let playerStatus = data.playerInfo.rating === 0 ? "Unrated" : "Rated";
  let isRated = playerStatus === "Rated" || useRating;
  if (useRating) {
    data.playerInfo.rating = +useRating;
  }

  // Unrated
  let ratedGames = data.games.filter((game) => game.rating !== 0);
  let avgOpp =
    (ratedGames.reduce((acc, game) => acc + game.rating, 0) + 1800 + 1800) /
    (ratedGames.length + 2);

  let ratedPts = ratedGames.reduce((acc, game) => acc + game.result, 0);
  let p = (ratedPts + 1) / (ratedGames.length + 2);
  let dp = getDP(p);

  let rating = avgOpp + dp;

  const modalStyle = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    maxWidth: "800px",
    width: "90%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    height: "80%",
    overflow: "auto",
    p: 4,
    "& img": {
      display: "block",
      width: "100%",
      margin: "20px 0",
    },
  };

  let ratingChanges: number[] = [];

  let text82 = `8.2     Determining the initial rating 'Ru' of a player.

8.2.1      If an unrated player scores zero in their first event this score is disregarded. Otherwise, their rating is calculated using all their results as in 7.1.4.

8.2.2      Ra is the average rating of the player's rated opponents plus two hypothetical opponents rated 1800. The result against these two hypothetical opponents is considered as a draw.

8.2.3      Ru = Ra + dp

Ru is rounded to the nearest whole number.

The maximum initial rating is 2200.

8.2.4      If an unrated player receives a published rating before a particular tournament in which they have played is rated, then they are rated as a rated player with their current rating, but in the rating of their opponents they are counted as an unrated player.`;

  return (
    <>
      <Typography variant="h2">Calculations</Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {isRated ? (
          <>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h4">Rating Change Calculation</Typography>
              <IconButton onClick={() => setRatedModal(true)}>
                <InfoIcon />
              </IconButton>
            </Box>

            <Box
              display={"flex"}
              alignItems={"center"}
              marginTop={"20px"}
              gap="20px"
            >
              Use K Value:
              <FormControl variant="standard">
                {/* <InputLabel id="klabel">K value</InputLabel> */}
                <Select
                  labelId="klabel"
                  value={kValue}
                  onChange={(e) => setKValue(+e.target.value)}
                >
                  <MenuItem value={40}>40</MenuItem>
                  <MenuItem value={30}>30</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                  <MenuItem value={15}>15</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Modal open={ratedModal} onClose={() => setRatedModal(false)}>
              <Box sx={modalStyle}>
                <Typography variant="h4">How does this work?</Typography>
                <Typography variant="body2">
                  According to{" "}
                  <Link href="https://handbook.fide.com/chapter/B022024">
                    FIDE Rating Regulations effective from 1 March 2024
                  </Link>
                  , the procedure for calculation of rating change for a rated
                  game is as follows:
                </Typography>
                <img src="/img/fide71.png" alt={"Official FIDE Rating List"} />
                <img
                  src="/img/fide83.png"
                  alt={"Determining the rating change for a rated player"}
                />
                Table for conversion of rating difference 'D', to scoring
                probability 'PD':
                <img
                  src="/img/pdtable.png"
                  alt="8.1.2 The table of conversion from rating difference, D, into scoring probability, PD"
                />
              </Box>
            </Modal>
            <Box width="100%" sx={{ "& pre": { whiteSpace: "pre-wrap" } }}>
              <pre>
                Change in rating = Sigma Delta R * K<br />
                where Delta R = score - PD.
                <br />
                PD is the probability of a win, as per table 8.1.2 from the FIDE
                Rating Regulations.
              </pre>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Round</TableCell>
                    <TableCell>Opponent Rating</TableCell>
                    <TableCell>Score</TableCell>
                    <TableCell>Rating Difference</TableCell>
                    <TableCell>PD</TableCell>
                    <TableCell>Rtg change</TableCell>
                    <TableCell>K × Rtg change</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {ratedGames.map((game) => {
                    const ratingDiff = data.playerInfo.rating - game.rating;
                    const PD = getPD(ratingDiff);
                    const deltaR = game.result - PD;
                    const kdeltaR = kValue * deltaR;
                    ratingChanges.push(kdeltaR);
                    return (
                      <TableRow key={game.round}>
                        <TableCell>{game.round}</TableCell>
                        <TableCell>{game.rating}</TableCell>
                        <TableCell>{game.result}</TableCell>
                        <TableCell>{ratingDiff}</TableCell>
                        <TableCell>{PD.toFixed(2)}</TableCell>
                        <TableCell>{deltaR.toFixed(2)}</TableCell>
                        <TableCell>{kdeltaR.toFixed(2)}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {(() => {
                const totalRtgChange = ratingChanges.reduce(
                  (acc, val) => acc + val,
                  0
                );
                return (
                  <pre>
                    Total rating change = {totalRtgChange.toFixed(2)}
                    <br />
                    New rating ={" "}
                    {(data.playerInfo.rating + totalRtgChange).toFixed(0)}
                  </pre>
                );
              })()}
            </Box>
          </>
        ) : (
          <>
            <Box
              display={"flex"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="h4">Initial Rating Calculation</Typography>
              <IconButton onClick={() => setUnratedModal(true)}>
                <InfoIcon />
              </IconButton>
            </Box>

            <Modal open={unratedModal} onClose={() => setUnratedModal(false)}>
              <Box sx={modalStyle}>
                <Typography variant="h4">How does this work?</Typography>

                <Typography variant="body2">
                  According to{" "}
                  <Link href="https://handbook.fide.com/chapter/B022024">
                    FIDE Rating Regulations effective from 1 March 2024
                  </Link>
                  , the procedure for calculation of initial rating for a player
                  is as follows:
                  <img
                    src="/img/fide714.png"
                    alt="7.1.4: A rating for a player new to the list shall be published when it is based on at least 5 games against rated opponents. This need not be met in one tournament. Results from other tournaments played within consecutive rating periods of not more than 26 months are pooled to obtain the initial rating. The rating must be at least 1400."
                  />
                  <img src="/img/fide82.png" alt={text82} />
                  Table for conversion of fracitional score 'p', to rating
                  difference 'dp':
                  <img
                    src="/img/dptable.png"
                    alt="8.1.1      The table of conversion from fractional score, p, into rating differences, dp"
                  />
                </Typography>
              </Box>
            </Modal>

            <Box width="100%" sx={{ "& pre": { whiteSpace: "pre-wrap" } }}>
              <pre>
                Number of rated games: {ratedGames.length}
                <br />
                Points scored in rated games:{" "}
                {ratedGames.reduce((acc, game) => acc + game.result, 0)}
              </pre>
              {ratedGames.length >= 5 ? (
                ratedPts > 0 ? (
                  <pre>
                    Consider two more hypothetical games with rating of 1800 and
                    result draw.
                    <br />
                    Rating average of opponents:
                    <br />
                    {ratedGames.map((game) => game.rating).join(", ")}, 1800,
                    1800
                    <br />
                    Average (Ra) = {avgOpp.toFixed(2)}
                    <br />
                    <br />
                    Points scored: {ratedPts + 1}
                    <br />
                    Out of: {ratedGames.length + 2}
                    <br /> <br />
                    Fractional Score (p) = {p.toFixed(2)}
                    <br />
                    Corresponding dp = {dp}
                    <br />
                    <br />
                    Ru = Ra + dp
                    <br />
                    Ru = {avgOpp.toFixed(2)} + ({dp})
                    <br />
                    Ru = {(avgOpp + dp).toFixed(2)}
                    <br />
                    Initial Rating = {rating.toFixed(0)}
                  </pre>
                ) : (
                  <pre>
                    No points scored in rated games, player does not get an
                    initial rating.
                  </pre>
                )
              ) : (
                <pre>
                  Less than 5 rated games played, player needs to play more
                  rated games to get an initial rating.
                </pre>
              )}
            </Box>
          </>
        )}
      </Box>
    </>
  );
}

function TournamentPlayer() {
  const { tid, id } = useParams();
  const [data, setData] = useState<PlayerData>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    async function getData() {
      let url = "";
      if (import.meta.env.DEV) {
        url += "http://localhost:3000";
      }
      url += `/api/tournament-player?tid=${tid}&pid=${id}`;

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

  let playerStatus = data?.playerInfo.rating === 0 ? "Unrated" : "Rated";
  let isRated = playerStatus === "Rated";

  return (
    <Container maxWidth="md" sx={{ marginTop: "20px", flex: 1 }}>
      <Typography variant="h3">FIDE Rating Calculations</Typography>

      <Box sx={{ height: 20 }}></Box>

      {data ? (
        <>
          <Typography variant="h4">{data.playerInfo.name}</Typography>
          <Typography variant="h5" sx={{ wordWrap: "break-word" }}>
            {data.playerInfo.tournament}
          </Typography>
          <Typography variant="subtitle1">
            {playerStatus} {isRated && <>({data.playerInfo.rating})</>}
          </Typography>
          <Link href={`/swiss/${tid}`}>Back to tournament</Link>

          <Box sx={{ marginBottom: "50px" }} />

          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Round</TableCell>
                  <TableCell>Opponent</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Result</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.games.map((game) => (
                  <TableRow key={game.round}>
                    <TableCell>{game.round}</TableCell>
                    <TableCell>{game.opponent}</TableCell>
                    <TableCell>{game.rating}</TableCell>
                    <TableCell>{game.result}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ marginBottom: "50px" }} />

          {/* Calculations... */}
          <Calculations data={data} />
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

export default TournamentPlayer;
