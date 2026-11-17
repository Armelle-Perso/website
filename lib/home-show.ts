// Current or upcoming show announced on the home page, as one quiet line
// (Coming up / Now showing · title · venue · date →) linking to Exhibitions.
// Turn on with `onHome: true` once the date is confirmed. The line switches
// from "Coming up" to "Now showing" at `start` and disappears after `end`.
export const HOME_SHOW = {
  onHome: false, // Batx: waiting for the signed contract and the opening date (17 Nov 2026)
  title: 'Semillas de luz',
  venue: 'Batx Santa Catalina, Palma',
  start: '2026-12-01',
  end: '2027-02-01',
  date: {
    en: 'December 2026',
    fr: 'décembre 2026',
    es: 'diciembre de 2026',
  } as Record<string, string>,
}

export function homeShowStatus(today = new Date().toISOString().slice(0, 10)): 'upcoming' | 'now' | null {
  if (!HOME_SHOW.onHome || today > HOME_SHOW.end) return null
  return today >= HOME_SHOW.start ? 'now' : 'upcoming'
}
