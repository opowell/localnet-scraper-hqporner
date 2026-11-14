# HQPorner scraper for Localnet

Reads `hqporner.com` pages for Localnet, a browser extension that is a personal search engine.
Localnet pulls it from here the first time it scrapes such a page, through the
[localnet-scrapers](https://github.com/opowell/localnet-scrapers) scraper source.

A video page (/hdporn/128609-make_that_pussy_an_oil_rig.html) is one video (see videoPage in Localnet's DOM helpers): its title the page's heading, its length the one shown under it ("34m 27s"), its performers the actresses it features (/actress/…), its tags its categories (/category/…), and the videos beside it the others the page links to. The site plays its videos in a player of another host's that refuses to play elsewhere, so the video's poster frame stands in for it. Any other page (the home page, a category, an actress, a search) is a listing of the videos it shows.

- `source.json`: what Localnet reads to know the scraper: its name, the URLs it reads, and the file to run.
- `hqporner.js`: the parser. It is injected into the scraped page after Localnet's DOM helpers (content-scripts/utils/dom.js) and defines `window.__dynamicParser`.
- `hqporner.test.ts`: its unit tests, run from a Localnet checkout (`pnpm parsers pull`, then `pnpm test parsers/localnet-scraper-hqporner`).
- `saved-pages/` (not in git): real pages saved from the site, which Localnet's `e2e/saved-pages.test.ts` scrapes. See Localnet's README.