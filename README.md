# FIDE Ratings Calculator

Calculator for FIDE initial rating/rating changes for tournaments on chess-results.com.

This is based on the latest [FIDE rating regulations](https://handbook.fide.com/chapter/B022024) effective from 1 March 2024.

> [!WARNING]  
> Since it uses the current rating rules, this tool gives correct calculations only for tournaments started after 1 March 2024.

## How to use

1. Go to the URL: https://fide-calc.vercel.app/
2. Open the tournament page on https://chess-results.com/. Copy the ID from the url.\
   Eg: In the URL ```https://chess-results.com/tnrABCDEF.aspx```, tournament ID is `tnrABCDEF`
3. Enter the tournament ID on the page. Click on Go. <img src="https://github.com/dipamsen/fide-calc/assets/59444569/ce124702-0b93-4238-997b-acfbd3bbeabd" width="700" />
4. From the dropdown menu of the list of players, select any player.
5. This opens up the player's tournament profile, which shows the list of games played, and respective calculations for
   1. Initial rating calculations for unrated player (if applicable)
   2. Rating change calculations for rated player
  
## Tech Stack
React (Vite + Typescript) + React Router + Material UI + Vercel Functions

## Limitations
- It assumes that all tournaments are FIDE rated events, so it shows rating change/initial rating even for non-FIDE rated tournaments.
- For calculation of Initial Rating, games played in all rated tournaments in the last 26 months are to be clubbed together (as per FIDE Rating Regulations). However, this tool takes into account only games from the currently opened tournament, for calculation of initial rating.
- K-value for a player cannot be determined from chess-results, so it has to be manually entered. It is possible that this data can be accessed from the FIDE player profile.

## License
[MIT License](./LICENSE)
