// A video's own address on HQPorner, /hdporn/<number>-<slug>.html, else null.
function hqpornerVideo(url) {
  const page = new URL(url, location.href)
  return /(?:^|\.)hqporner\.com$/.test(page.hostname) && /^\/hdporn\/\d+-[^/]+\.html$/.test(page.pathname) ? `${page.origin}${page.pathname}` : null
}

// A video page (/hdporn/128609-make_that_pussy_an_oil_rig.html) is one video (see videoPage): its title the page's
// heading, its length the one shown under it ("34m 27s"), its performers the actresses it features (/actress/…), its
// tags its categories (/category/…), and the videos beside it the others the page links to. The site plays its videos
// in a player of another host's that refuses to play elsewhere, so the video's poster frame stands in for it. Any other
// page (the home page, a category, an actress, a search) is a listing of the videos it shows.
function parseHQPorner(_profileId) {
  if (!/(?:^|\.)hqporner\.com$/.test(location.hostname)) {
    return null
  }
  if (!hqpornerVideo(location.href)) {
    return videoListing(hqpornerVideo)
  }
  const length = /(?:(\d+)h\s*)?(\d+)m\s*(\d+)s/.exec(document.querySelector('li.fa-clock-o')?.textContent || '')
  const id = /^\/hdporn\/(\d+)-/.exec(location.pathname)[1]
  const poster = document.querySelector(`img[src*="/${id}"], img[data-src*="/${id}"]`)
  return videoPage({
    player: null,
    title: document.querySelector('h1')?.textContent.trim() || undefined,
    poster: (poster && imageSource(poster)) || metaContent('og:image') || '',
    description: null,
    performers: namedLinks('a[href^="/actress/"], a[href*="hqporner.com/actress/"]'),
    tags: namedLinks('a.tag-link[href*="/category/"]'),
    related: linkUrls('a[href*="/hdporn/"]').map(hqpornerVideo).filter(Boolean),
    seconds: length ? (Number(length[1] || 0) * 60 + Number(length[2])) * 60 + Number(length[3]) : null,
  })
}

// The parser a scrape calls.
registerParser(parseHQPorner)
