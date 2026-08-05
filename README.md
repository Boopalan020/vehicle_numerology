# Enn — Vehicle Registration Numerology

Enn checks a vehicle registration plate against **எண் கணிதம்** (Tamil vehicle-plate
numerology) and scans a whole range of candidate numbers at once, so you can find
the best-suited one instead of checking numbers one at a time.

> Numerology carries real weight for some people and reads as trivia to others.
> Enn describes results neutrally ("this total falls in the Adhishtam band")
> rather than making claims — take it as a traditional reference, not advice.

## Running it

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build (outputs to dist/)
npm run test     # run the calculation test suite
```

Everything runs and is calculated **in your browser** — there's no server and no
account. Your search history is saved only in that browser's local storage; clear
your browser data and it's gone.

---

## Finding the right number

This is the core workflow — five steps, top to bottom on the left-hand panel
(or the top panel on a phone/tablet).

1. **Enter the plate series.** Type into the boxed cells: two letters, two
   digits, then one or two more letters — e.g. `TN` `09` `AB`, or `TN` `09`
   `L` if your series only uses one trailing letter. The last box is optional;
   leave it blank for a one-letter series. Typing auto-advances to the next
   box; backspace on an empty box jumps back.
2. **Set the range.** Drag either end of the slider, or type directly into
   the `From`/`To` number fields on each side of it. Both must be 4-digit
   numbers (1000–9999), and `To` must be at or after `From`. This is the
   block of registration numbers you're choosing between.
3. **Press Calculate.** Every number in the range is scored — the button
   shows a spinner while it works, and for a large range you'll see a running
   count as results stream in rather than a frozen screen.
4. **Scan the results** using whichever view suits you (see below) — look
   for a good band, or use the band filter to only show the ones you'd
   actually consider.
5. **Click any result** to open its full breakdown, and pin the ones you're
   deciding between so you can compare them side by side.

## Reading a result

Every candidate number gets a **total**, and that total is classified into a
named band — from best to worst as the chart itself defines it:

| Band | Tamil | Meaning |
| - | - | - |
| Miga Miga Adhishtam | மிக மிக அதிர்ஷ்டம் | Highly auspicious |
| Adhishtam | அதிர்ஷ்டம் | Auspicious |
| Sumar | சுமார் | Moderate |
| Dhuradhishtam | துர அதிர்ஷ்டம் | Weak luck |
| Sodhanai | சோதனை மிக்கது | Testing / trials |
| Abathu | ஆபத்து | Inauspicious |

If a total isn't directly on the chart, Enn sums its digits and checks again
(the standard numerology "digit root" step) before giving up — click a result
to see this worked out, not just the final band.

---

## Feature reference

### Plate & range (left panel / top panel)

The plate boxes and range slider described above, plus the **Calculate**
button. Your eight most recent searches appear under **Recent** and can be
clicked to re-run them instantly.

### Band filter

The row of pill-shaped chips above the results (Miga Miga, Adhishtam, Sumar,
Dhuradhishtam, Sodhanai, Abathu) shows how many results fall in each band.
Click one to show only that band; click it again to clear the filter.

### Search by number

The small search box next to the band filter narrows results to numbers
containing what you type — useful for checking whether one specific number
made it into a listed range.

### Three ways to view results

Switch between them with the **Tiles / Ledger / Scan** control:

- **Tiles** — a card per number, showing the number, its total, and its band
  at a glance. The default view.
- **Ledger** — the same data as a compact sortable-by-eye table, better for
  scanning many results at once.
- **Scan** *(tablet and larger screens only)* — a color grid: each row is a
  last digit (0–9), each column ten consecutive numbers, and each cell is
  colored by its band. Wider ranges scroll sideways. This is the fastest way
  to spot clusters of good numbers in a large range — a banner above the
  grid also tells you how many highly auspicious numbers are in view, and
  where the first one is.

### Result detail

Click any tile, ledger row, or Scan cell to open its full arithmetic: each
letter's and digit's value, the series total, the candidate number's digit
sum, and — if it took one — the digit-reduction step to reach its final band.

### Compare

Hover a tile and click the pin icon (or open a result's detail) to pin it for
comparison — up to four at once, shown in a tray docked at the bottom of the
results.

### Language

The **EN / TA** switch in the top corner translates the whole interface,
including band names, into Tamil — using the source chart's own wording, not
a machine translation.

### Theme

The toggle next to the language switch swaps between light and dark. Both are
designed with the same care, not an inverted afterthought.

### On a phone

Below tablet width there's no permanent side panel, so a **↑ back to plate &
range** button appears once you've scrolled down a long result list — tap it
to jump straight back to the controls instead of scrolling all the way up.

---

## What's under the hood, briefly

React + Vite, Tailwind v4, HeroUI. The actual number-crunching runs in a Web
Worker so a full 1000–9999 range doesn't freeze the tab. See `src/lib/numerology.js`
for the calculation itself and its test suite for the exact rules encoded from
the source chart.
