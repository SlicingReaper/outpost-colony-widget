# ⌂ OUTPOST// — colony-trading game

![macOS](https://img.shields.io/badge/macOS-Übersicht-3ef0ff?style=flat-square&logo=apple&logoColor=white&labelColor=040914) ![Vibecoded](https://img.shields.io/badge/vibecoded-with%20Claude-ff5ad9?style=flat-square&labelColor=040914)

A turn-based economy game in a 230 × 314 desktop widget. You and three AI rivals settle a small frontier grid for 12 months: claim land, put robots to work, survive shortages and out-trade everyone. An original game in the spirit of the 1980s land-grab economy classics. No backend: the whole game runs in the widget.

| File | What |
|:--|:--|
| `outpost.jsx` | The whole game. Copy it into Übersicht's widgets folder and it works. |

## Play

Mouse only. Each month has four phases; the header shows where you are (`MO 3/12 · BUILD`).

| Phase | What you do |
|:--|:--|
| **1 · CLAIM** | Click a free plot to take it (one per month), or *PASS*. Rivals then grab theirs. |
| **2 · BUILD** | Click one of your plots, then pick a robot job: **F**ood, **E**nergy or **O**re. The button shows the price (robot + outfit); re-outfitting an existing robot costs only the outfit. *DONE* ends your turn. |
| **3 · PRODUCE** | Every robot works its plot. You see what you made, plus any colony event. |
| **4 · MARKET** | For food, then energy, then ore: *SELL* or *BUY* one unit at a time from the store, then *NEXT*. |

## The economy

- **Terrain decides yield:** ≈ river is best for food (4), plains for energy (3), ▲ mountains for ore (1 + one per peak). Each yield varies ±1.
- **Energy:** every robot burns 1 energy per month. Without energy a robot makes half.
- **Food:** every colonist eats 3 a month. Go hungry and one of your robots idles next month.
- **Ore:** each new robot is built from the store's ore. When ore runs low, robots get more expensive (base $100).
- **Prices follow the store's stock:** scarce goods sell high, gluts sell low. The store pays 75 % of its asking price.
- **Scale:** three or more robots on the same job earn +1 each.
- **Events** (about 60 % of months): solar flare, dust storm, rich vein, river flood, supply ship, pest bloom.

## Winning

After month 12: **score = cash + land ($400 per plot) + robots ($120 each) + goods at the store's sell price**. Highest score wins. The four scores added up decide the colony's fate: ABANDONED, STRUGGLING, THRIVING or BOOMTOWN. The three AI rivals each pick land and jobs by what the market pays, so the market moves under you.

**Saved automatically:** a game survives reloads, sleep and reboots (`~/Library/Application Support/STUDYTERM/outpost-save.json`). Your best score is kept in `outpost-best`.

## 🚀 Install

1. Download this repo (green **Code** button → *Download ZIP*) and double-click **`install.command`**. The first time, macOS may block it: right-click → *Open*.
   It installs [Übersicht](https://tracesof.net/uebersicht/) if you don't have it and copies `outpost.jsx` into its widgets folder.
2. Click the widget to use it. If clicks fall through to the desktop: Übersicht menu-bar icon → this widget → turn on interaction.

- **Needs:** macOS 13+ · nothing else, the game is a single file
- **By hand:** Copy `outpost.jsx` into Übersicht's widgets folder (menu-bar icon → *Open Widgets Folder*).
- **Remove:** delete `outpost.jsx` from the widgets folder.

## 🎨 Look and position

Out of the box it sits in its default spot in the cyan terminal theme. Install [**WIDGET//CTL**](https://github.com/SlicingReaper/widgetctl) to drag it anywhere on a grid and pick from 16 colour schemes × 8 styles, and to get `⌃⌥⌘W`, which hides all widgets at once.

## 🧩 Part of a collection

This widget is one of fifteen that share the same retro-terminal look, the same theming and the same show/hide hotkey. Each works on its own; together they make a desktop dashboard.

| | Widget | What |
|:-:|:--|:--|
| 💰 | [**WALLET//Ð**](https://github.com/SlicingReaper/points-wallet-widget) | Points wallet: earn for habits, spend on rewards, lock savings, keep a streak |
| 🔥 | [**75//HARD**](https://github.com/SlicingReaper/75-hard-widget) | 75 Hard challenge tracker: 7 daily tasks, day counter, auto-fail on a missed day |
| ⏱️ | [**STUDY//TERM**](https://github.com/SlicingReaper/study-timer-widget) | Study stopwatch that logs what you did, with a stats page and points |
| ✎ | [**NOTE//PAD**](https://github.com/SlicingReaper/notepad-widget) | Checklist notes with deadline countdowns, auto-expiry and a bin |
| “ | [**QUOTE//DAY**](https://github.com/SlicingReaper/quote-of-the-day-widget) | A new quote every midnight from a pool of 300, with likes and your own quotes |
| ▦ | [**TETRIS//GRID**](https://github.com/SlicingReaper/tetris-widget) | Tetris on the desktop: hold, ghost piece, levels, best score |
| ◉ | [**PONG//SOLO**](https://github.com/SlicingReaper/pong-widget) | Single-player Pong: keep the ball up, it speeds up every hit |
| ◎ | [**PONG//DUO**](https://github.com/SlicingReaper/pong-duo-widget) | Two-player Pong, 3 widgets wide: W/S vs ↑/↓, first to 7 |
| ⊞ | [**2048//TILE**](https://github.com/SlicingReaper/2048-widget) | 2048 with undo, keyboard or drag, saved between sessions |
| ⌂ | [**OUTPOST//**](https://github.com/SlicingReaper/outpost-colony-widget) ← you are here | Colony-trading game: claim land, outfit robots, trade against 3 AI rivals |
| ☠ | [**DOOM//TERM**](https://github.com/SlicingReaper/doom-widget) | DOOM shareware Episode 1 in a 2-column widget: WebAssembly engine, savegames kept |
| ◍ | [**GLOBE//GUESS**](https://github.com/SlicingReaper/globe-widget) | Daily mystery country on a spinning globe: every guess glows hotter the closer it is |
| ◍ | [**ATLAS//QUIZ**](https://github.com/SlicingReaper/atlas-quiz-widget) | Sporcle-style map quiz: type a name, the country lights up green. World, continents, US states |
| W | [**WORDLE//**](https://github.com/SlicingReaper/wordle-widget) | Wordle in EN · FR · ES · DE: daily word, a new word any time, streaks, guess distribution |
| 🎛️ | [**WIDGET//CTL**](https://github.com/SlicingReaper/widgetctl) | Menu-bar app that arranges and themes all the widgets, plus a ⌃⌥⌘W show/hide hotkey |

**Install all of them at once:** [`vibecoded` → install-all.command](https://github.com/SlicingReaper/vibecoded) · 🤖 Vibecoded with [Claude](https://claude.ai): I designed, directed and tested it, the AI wrote most of the code.
