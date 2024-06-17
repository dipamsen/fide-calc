import cheerio from "cheerio";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tid = url.searchParams.get("tid");
  const pid = url.searchParams.get("pid");
  if (!tid || !pid) {
    return new Response("No tournament ID or player ID provided", {
      status: 400,
    });
  }

  const res = await fetch(
    `https://chess-results.com/${tid}.aspx?lan=1&art=9&snr=${pid}`
  );
  if (!res.ok) {
    return new Response("Tournament not found", { status: res.status });
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  //  first table with class "CRs1" contains player info
  // (each row has two columns, first column is the field name, second column is the value)
  //   rows are: Name, Starting Rank, Rating, Rating Nat, Rating INT, PerfRating, RatingChange (?), Pts, rank, federation, ident number, fide id, year of birth
  // (here rating change row may or may not be present)
  // we need: name, rating, rank, fide id

  //   second table with class "CRs1" contains player's games
  // columns are: round, board, srno, title, opponent name, rating, fed, points, result
  // result column has points scored by player in that game, it may contain symbol ½ for draw which should be converted to 0.5
  // we need: opponent round, name, rating, result

  // player info
  const rawInfo = $("table.CRs1").first().find("tr");

  const playerInfo = {
    name: rawInfo.eq(0).find("td").eq(1).text().trim(),
    rating: +rawInfo.eq(2).find("td").eq(1).text(),
    rank: +rawInfo.eq(-6).find("td").eq(1).text(),
    fideId: rawInfo.eq(-2).find("td").eq(1).text(),
  };

  // games
  const games = $("table.CRs1").eq(1).find("tr");
  const playerGames = games
    .map((i, el) => {
      const tds = $(el).find("td");
      const result = tds.eq(-1).text().trim();
      return {
        round: +tds.eq(0).text(),
        opponent: tds.eq(4).text().trim(),
        rating: +tds.eq(5).text(),
        result: result === "½" ? 0.5 : +result,
      };
    })
    .get()
    .filter((x) => x.round);

  // also get tournament title from first h2
  const title = $("h2").first().text();

  return new Response(
    JSON.stringify({
      playerInfo: {
        ...playerInfo,
        points: playerGames.reduce((acc, game) => acc + game.result, 0),
        totalRounds: playerGames.length,
        tournament: title,
      },
      games: playerGames,
    }),
    {
      status: 200,
      headers: { "content-type": "application/json" },
    }
  );
}
