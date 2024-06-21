import cheerio from "cheerio";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tid = url.searchParams.get("id");
  console.log(tid);
  if (!tid) {
    return new Response("No tournament ID provided", { status: 400 });
  }

  const res = await fetch(
    `https://chess-results.com/${tid}.aspx?lan=1&art=4&fed=IND&turdet=ALL&flag=30&zeilen=99999`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "__EVENTTARGET=&__EVENTARGUMENT=&__VIEWSTATE=%2FwEPDwUJNjMxNzkyOTk0D2QWAmYPZBYCAgcPZBYCAgEPZBYMZg8WAh4HVmlzaWJsZWcWAmYPZBYCAgMPFgIeBXN0eWxlBURXSURUSDoxMDAwcHg7SEVJR0hUOjk3cHg7cG9zaXRpb246cmVsYXRpdmU7YmFja2dyb3VuZC1jb2xvcjojMzM0MTY2OxYEAgEPFgIfAQUrV0lEVEg6MTAwMHB4O0hFSUdIVDo5N3B4O3Bvc2l0aW9uOnJlbGF0aXZlOxYCAgEPFgIfAQU1V0lEVEg6NzI4cHg7SEVJR0hUOjk3cHg7bGVmdDoyNzJweDtwb3NpdGlvbjphYnNvbHV0ZTtkAgMPFgIeA3NyYwUjaW1hZ2VzL2NoZXNzUmVzdWx0c19FTkdfMTAwMHg5MC5qcGdkAgQPFgIfAGcWAmYPZBYEAgEPFgIeCWlubmVyaHRtbAUPTG9nZ2VkIG9uOiBHYXN0ZAIDDxYCHwMFHlNlcnZlcnRpbWUgMjEuMDYuMjAyNCAxOTozMDozNmQCBQ8WAh8AZ2QCBg8WAh8AZ2QCCA8WAh8AaGQCCw9kFgJmD2QWAgIDD2QWAmYPZBYCZg8WAh4Fd2lkdGgFAzgzNBYCAgEPFgIfAQU6UEFERElORzowcHggMHB4IDBweCAycHg7RkxPQVQ6bGVmdDtNQVJHSU46MHB4O1dJRFRIOjgzNHB4OxYCAgEPZBYCAgMPZBYEAgEPPCsAEQIBEBYAFgAWAAwUKwAAZAIDDzwrABECARAWABYAFgAMFCsAAGQYAgUSY3RsMDAkUDEkR3JpZFZpZXcyD2dkBRJjdGwwMCRQMSRHcmlkVmlldzEPZ2S7DUpZDzffIA%2FxXYG4vy%2FMFCHQPdmgCPLCIbPjaGfHUQ%3D%3D&cb_alleDetails=Show+tournament+details&txt_name=&__VIEWSTATEGENERATOR=D5991272&__EVENTVALIDATION=%2FwEdAAL0CXEuvLgfPUN9fGNA5KC%2FolKyfaSroikh4PwByU0fhqxZ30OUy%2B5JXAimdmTgNGpvzP0QBqk2saxm0zOO8Nte",
    }
  );
  if (!res.ok) {
    return new Response("Tournament not found", { status: res.status });
  }
  const html = await res.text();
  const $ = cheerio.load(html);

  // title: first h2 on page
  // player crosstable: table with class "CRs1"
  // - columns: rank, flag, title, name, rtg, fed, rd1, rd2, ..., rdn, pts, tb1, tb2, tb3, tb4
  // to send back: title, players - name, rtg, pts
  // on name field href points to player's profile

  // BUG: rank can be empty in  case of ties
  // in that case, we can use the previous filled rank (TODO)
  const title = $("h2").first().text();
  const players = $(".CRs1 tbody tr")
    .map((i, el) => {
      const tds = $(el).find("td");
      const link = tds.eq(3).find("a").attr("href");
      return {
        rank: +tds.eq(0).text(),
        name: tds.eq(3).text(),
        rating: +tds.eq(4).text(),
        points: +tds.eq(-5).text(),
        link: link ? `https://chess-results.com/${link}` : null,
        id: link ? +link.split("=").at(-1) : null,
      };
    })
    .get()
    .filter((x) => x.name);

  return new Response(
    JSON.stringify({
      title,
      players,
    }),
    { status: 200, headers: { "content-type": "application/json" } }
  );

  // return new Response(html, {
  //   headers: {
  //     "content-type": "text/html",
  //   },
  // });
}
