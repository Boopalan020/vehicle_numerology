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

This is the core workflow: top to bottom in the left column on a computer, or
the first screen on a phone.

1. **Enter your plate series.** Type it straight onto the plate: two letters,
   two numbers, then one or two more letters, e.g. `TN 09 AB`, or `TN 09 L`
   if your series uses one trailing letter (leave the last, dashed slot
   blank). Typing moves to the next slot by itself; backspace on an empty
   slot goes back. You can also paste a whole series.
2. **Enter the numbers you can choose from.** Type the first and last number
   of the block the RTO or dealer has open into **From** and **To**. Both
   must be between `0001` and `9999` (type `7` and it becomes `0007`), and
   `To` must be the same as `From` or higher.
3. **Press Check numbers.** The button shows how many numbers it will check.
   Every number is scored in your browser; for a big block you'll see a
   running count as results arrive.
4. **Read the results, luckiest first.** A one-line summary and a coloured
   bar show how the whole block splits across the verdicts. Tap a verdict
   (e.g. **Lucky**) to show only those numbers.
5. **Tap any number** to see why it got its verdict, and pin (☆) the ones
   you're deciding between to compare them side by side.

On a phone, once results are in, the form folds into a small plate header.
Tap the back arrow on it to change the plate or numbers.

## Reading a result

Each number gets a plain-language **verdict**, with the chart's own band
name underneath. Verdicts always come with an icon too, so they never rely
on colour alone:

| Verdict | Tamil | Chart band |
| - | - | - |
| Very lucky | மிக நல்லது | Miga Miga Adhishtam (மிக மிக அதிர்ஷ்டம்) |
| Lucky | நல்லது | Adhishtam (அதிர்ஷ்டம்) |
| Average | சுமார் | Sumar (சுமார்) |
| Weak | குறைவு | Dhuradhishtam (துர அதிர்ஷ்டம்) |
| Trouble | சோதனை | Sodhanai (சோதனை மிக்கது) |
| Avoid | தவிர்க்கவும் | Abathu (ஆபத்து) |

The verdict comes from a **total**: the plate series' letter and number
values plus the digits of the number. If a total isn't on the chart, Enn
adds its digits again (the standard numerology "digit root" step). The
"why" panel explains this in a sentence and shows the full working.

---

## Feature reference

### Filters, search and sort

Above the results:

- **Verdict chips** (Very lucky, Lucky, Average, Weak, Trouble, Avoid), each
  with its count, show only that verdict. Tap more than one to combine them,
  e.g. **Very lucky + Lucky**; **All** clears them. Only verdicts present in
  the block get a chip.
- **✦ Fancy** shows only fancy numbers (below). It combines with the verdict
  chips, so **Lucky + Fancy** gives numbers that are both lucky and
  good-looking.
- **Find a number** narrows the list to numbers containing what you type.
- **Sort** is **Best first** by default (by verdict, then by number), or
  **Number order**.

### Fancy numbers

Separately from luck, Enn flags numbers with an eye-catching digit pattern.
They're marked in blue with a **✦** and the pattern's name, and as a blue
corner dot in the grid.

| Pattern | Example | Tier |
| - | - | - |
| Quad | 7777 | Premium |
| Sequence | 1234, 6543 | Premium |
| Single digit | 0001–0009 | Premium |
| Round | 5000 (Premium), 9900 (Fancy) | Premium / Fancy |
| Mirror | 7337, 1001 | Fancy |
| Repeating pair | 1212 | Fancy |
| Double pair | 1122 | Fancy |
| Triple | 1119, 9111 | Fancy |

While **✦ Fancy** is on, a second row lets you narrow to one pattern. These
patterns are Enn's own rules, not the RTO's official fancy-number list.

### List and grid

- **List** (default): one row per number with the number as a small plate,
  its verdict, chart name and total, any fancy pattern, and a pin button.
  Big blocks load 240 rows at a time as you scroll.
- **Grid** *(tablet and larger)*: a coloured square per number; each row is
  a last digit (0–9) and each column ten numbers. It's the quickest way to
  spot clusters of good numbers in a big block. A legend names each colour.

### Why this number

Tap a row or grid square to see the verdict, a one-sentence explanation,
any fancy pattern, and **The full working** (each letter's value, the digit
sum, the total and any reduction step). On a computer it opens beside the
results; on a phone it slides up from the bottom.

### Compare

Pin up to four numbers with ☆ in the list or the "why" panel. A bar at the
bottom shows what's pinned; **Compare** opens them side by side.

### Checked before

Your eight most recent checks appear under the form; tap one to run it
again. They're kept only in this browser.

### Language and theme

**EN / தமிழ்** in the top corner switches the whole interface, including
verdicts and band names, to Tamil. The moon / sun button next to it switches
between light and dark. Until you use it, Enn follows your device's setting;
after that it remembers your choice in this browser.

---

## What's under the hood, briefly

React + Vite and Tailwind v4, with Catamaran (English and Tamil) and Saira
Condensed (plate lettering) from Google Fonts. The number-crunching runs in
a Web Worker so a full 0001–9999 range doesn't freeze the tab. See
`src/lib/numerology.js` for the calculation and its test suite for the exact
rules encoded from the source chart, and `src/lib/fancy.js` for the
fancy-number patterns. Colours and type live as tokens in `src/index.css`.
