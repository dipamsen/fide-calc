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

  //   second table with class "CRs1" contains player's games
  // columns are: round, board, srno, title, opponent name, rating, fed, points, result
  // result column has points scored by player in that game, it may contain symbol ½ for draw which should be converted to 0.5
  // we need: opponent round, name, rating, result

  // player info
  const rawInfo = $("table.CRs1").first().find("tr");

  const playerInfo = {
    name: "",
    rating: 0,
    rank: 0,
    fideId: "",
  };
  let clean = (str) => str.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  rawInfo.each((i, el) => {
    const field = $(el).find("td").eq(0).text().trim().toLowerCase();
    const value = $(el).find("td").eq(1).text().trim();
    if (field.includes("name")) {
      playerInfo.name = value;
    } else if (clean(field) === "rating") {
      playerInfo.rating = +value;
    } else if (clean(field) === "rank") {
      playerInfo.rank = +value;
    } else if (field.includes("fideid")) {
      playerInfo.fideId = value;
    }
  });

  // games
  let tbl = $("table.CRs1").eq(1);
  const games = tbl.find("tr");
  let ri = tbl
    .find("th")
    .toArray()
    .findIndex((el) => clean($(el).text()) === "res");
  const playerGames = games
    .map((i, el) => {
      const tds = $(el).find("td");
      if (tds.length < 6) return null;
      let bye = false;
      let result = tds.eq(ri).text().trim();
      if (result.startsWith("-")) {
        result = result.substring(1).trim()[0];
        bye = true;
      }
      return {
        round: +tds.eq(0).text(),
        opponent: tds.eq(4).text().trim(),
        rating: +tds.eq(5).text(),
        result: result === "½" ? 0.5 : +result,
        bye,
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
