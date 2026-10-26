# Access to Play

A web app that helps families in Colorado find adaptive sports programs by **age, location, type of sport, accessibility needs, and cost**, and helps teens find **volunteer opportunities** with those programs.

**Try it:** https://USERNAME.github.io/access-to-play/

**Built by:** [names, school, grade] for the 2026 Congressional App Challenge, [congressional district].

## Why we built this

_(Write this part yourselves, in your own words: what you've seen in karate, who you've trained with, and what problem you noticed.)_

## How to run it

**Online:** open the link above on any phone, tablet or computer.

**On your own computer:**

1. Keep all the files in the same folder.
2. Double-click `index.html`. It opens in your web browser. No install is needed.
3. To see it the way a phone would, open your browser's developer tools and turn on the phone view, or just open it on a phone.

## The files

| File | What it does |
|---|---|
| `index.html` | The structure of the page: header, tabs, the filter form, and empty spots where results go. |
| `style.css` | How it looks: colors, fonts, spacing, dark mode, and the layout that turns into one column on phones. |
| `data.js` | The information: a list of programs and a list of volunteer jobs. Each one is a JavaScript object. |
| `app.js` | The logic: reads the form, checks each program against the choices, and draws a card for each match. |
| `README.md` | This file. |
| `LICENSE` | The MIT open-source license, which lets anyone use or build on this code. |

## How the search works (in plain English)

Every time someone changes a filter, `app.js` runs `showPrograms()`:

1. **`getChoices()`** reads the age box, the region, the type of sport, the budget, and which needs are checked.
2. It loops through every program in `data.js` and calls **`programMatches(program, choices)`**, which returns `true` or `false`:
   - **Age:** too young or too old? Then it's out. If the program didn't list an age limit, we don't rule it out. We tell the family to ask instead.
   - **Region:** does the program's list of regions include the one the family picked?
   - **Type of sport:** each program has a `types` list (like "Team sports" or "Martial arts"). We used a short fixed list of categories so families don't have to scroll through 60 sport names.
   - **Needs:** the program has to support *every* need the family checked. That uses a `for` loop and `.includes()`.
   - **Cost:** "Free only" keeps free programs. "Affordable" keeps free programs, low-cost programs, and programs that offer financial aid. Many programs don't post prices, so those cards say "Ask about cost" instead of guessing.
3. Each match goes to **`makeProgramCard()`**, which builds the HTML for one card.
4. The count at the top updates ("3 programs match").

The volunteer tab works the same way with fewer filters (your age and region).

## The other features

**My list (saving programs).** Each card has a "Save to my list" button. Saved program names go into the browser's `localStorage`, which only stores text. So we turn the list into text with `JSON.stringify` and back into a list with `JSON.parse`. Every read and write is wrapped in `try/catch`, because some browsers (like private windows) block storage. When that happens, the list still works until the page closes. Look for "Step 5" in `app.js`.

**Larger text and high contrast.** Each button turns a class on or off on the `<html>` element. Every size in `style.css` uses `rem`, which is based on the `<html>` font size, so changing it to 125% makes the whole page bigger at once. High contrast swaps the color variables for black, white and bright yellow. Look for "Step 6" in `app.js`.

**Questions to ask.** This is plain HTML checkboxes with no JavaScript. Many programs don't post their prices or ages, so we wrote the questions a parent should ask when they call.

## Confirming programs (our team's job)

Every program in `data.js` has a `verified` field. It starts as `null`. When one of us calls or emails a program and confirms its ages, cost and schedule:

1. Fix anything that was wrong in that program's entry.
2. Change `verified: null` to something like `verified: "Phone call, Nov 2, 2026"`.
3. Refresh the page. The card now shows "✓ Confirmed by our team", and the count at the bottom goes up.

Start with the programs that say "Ask about cost" or "Ask program about ages".

## Accessibility choices we made (and why)

An app about accessibility should be accessible itself.

- **Fonts:** Atkinson Hyperlegible was designed by the Braille Institute for readers with low vision. Lexend was designed to make reading easier.
- **Large text and tap targets:** inputs are at least about 46 px tall, so they're easier for people with limited hand control.
- **Keyboard friendly:** every control works with Tab and Enter, and there's a thick outline showing where you are.
- **Screen readers:** every input has a real `<label>`, and the result count uses `aria-live` so it gets read out loud when it changes.
- **Not color alone:** cost tags show words ("Free", "Fees apply"), not just a color.
- **Dark mode:** the colors switch automatically if the device is set to dark mode.
- **Larger text and high contrast buttons:** for people who need them, remembered for next time.

## Where the data came from

We researched each program online in October 2026, using the organization's own website where we could, and city pages, news stories, nonprofit listings (Colorado Gives) and the Colorado.com adaptive sports guide where we couldn't. Every card links to where its information came from.

We only filled in an age limit or a price when the program published one. Otherwise the card says "Ask program about ages" or "Ask about cost". We did that on purpose so we wouldn't guess. If we couldn't find which disabilities a program supports, the card says to ask, and the program doesn't show up when a family checks a needs box.

Programs marked "✓ Confirmed by our team" are ones we called or emailed ourselves.

## How to add a program

Open `data.js`, copy one `{ ... }` block, paste it at the end of the `programs` list (with a comma before it), and change the values. Pick its `types` from the list at the top of the file, and leave `verified: null` until someone on the team confirms it. Save, and refresh the page.

On GitHub, open `data.js`, click the pencil icon, make the change, and click **Commit changes**. The live site updates in a minute or two.

## Questions judges might ask

- **Why a website and not a phone app?** Families can use it on any phone, tablet, or computer with no download. Coaches and schools can share it with one link.
- **Why didn't you use a database?** The list is small, so a JavaScript file is simpler and doesn't need a server. If it grew to hundreds of programs, we'd move the data to a database or a spreadsheet.
- **How do you know the information is right?** Every card links to its source. We're calling and emailing programs to confirm details, and confirmed cards say so. The app also tells families to confirm before signing up and gives them a list of questions to ask.
- **What would you add next?** Search by distance from your ZIP code, more programs (especially martial arts and programs outside the Front Range), schedules and registration dates, Spanish, and a form that lets programs submit and update their own info.

## How we used AI

We used Claude (by Anthropic) as a coding assistant. It helped research Colorado adaptive sports programs, wrote the first version of the HTML, CSS and JavaScript, and added the comments that explain each part. We asked it to keep the code simple, with no frameworks, so we could understand every line.

What we did ourselves: _(list only what's true, for example: came up with the idea, chose the filters, tested the app on our phones and with only a keyboard, called programs to confirm their details, added or fixed programs, recorded the demo)._

## License

This project is open source under the MIT License. See the `LICENSE` file.
