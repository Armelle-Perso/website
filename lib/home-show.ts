// Current or upcoming show announced on the home page, as one quiet line
// (Coming up / Now showing · title · venue · date →) linking to Exhibitions.
// Turn on with `onHome: true` once the date is confirmed. The line switches
// from "Coming up" to "Now showing" at `start` and disappears after `end`.
export const HOME_SHOW = {
  onHome: true, // Batx: opening date confirmed by Jess on 18 Nov 2026
  title: 'Semillas de luz',
  venue: 'Batx Santa Catalina, Palma',
  start: '2026-12-03',
  end: '2027-02-01',
  date: {
    en: 'opening Thu 3 December, 6 pm',
    fr: 'vernissage jeudi 3 décembre, 18 h',
    es: 'inauguración jueves 3 de diciembre, 18 h',
  } as Record<string, string>,
}

export function homeShowStatus(today = new Date().toISOString().slice(0, 10)): 'upcoming' | 'now' | null {
  if (!HOME_SHOW.onHome || today > HOME_SHOW.end) return null
  return today >= HOME_SHOW.start ? 'now' : 'upcoming'
}
