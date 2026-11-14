import { afterEach, describe, expect, it } from 'vitest'
import { parserLoader, resetPage, visit } from '#scraper-test'

// The parser, evaluated with the helpers it is injected with, as a scrape runs it.
const load = parserLoader(__dirname)

afterEach(resetPage)

describe('hQPorner', () => {
  it('reads a video\'s actresses, categories and length', () => {
    visit('https://hqporner.com/hdporn/128609-a_video.html', `<h1>a video</h1><ul><li class="icon fa-clock-o">34m 27s</li>
      <li class="icon fa-star-o">featuring <a href="/actress/madison-morgan">Madison Morgan</a></li></ul><a class="tag-link" href="/category/redhead">redhead</a>`)
    const parsed = load('hqporner.js', ['parseHQPorner']).parseHQPorner()
    expect(parsed.title).toBe('a video')
    expect(parsed.details.slice(1, 5)).toEqual([
      ['performers', [{ text: 'Madison Morgan', url: 'https://hqporner.com/actress/madison-morgan' }]],
      ['categories', []],
      ['tags', [{ text: 'redhead', url: 'https://hqporner.com/category/redhead' }]],
      ['minutes', 34],
    ])
  })

  it('reads https://hqporner.com/ as a listing of what it links to', async () => {
    visit('https://hqporner.com/', '<a href="/hdporn/128609-a_video.html">A</a><a href="/category/anal">anal</a>')
    expect(await load('hqporner.js', ['parseHQPorner']).parseHQPorner()).toEqual({ listing: true, links: [{ url: 'https://hqporner.com/hdporn/128609-a_video.html', score: 1 }] })
  })
})
