# Build Canada: The Album — website

This is a complete, dependency-free album microsite for **Build Canada: The Album** by **Ajay & Friends**. It uses plain HTML, CSS and JavaScript, so there is no package installation and no build step.

## What is included

- Permanent album artwork and session photography
- Seven-song tracklist
- Spotify and Apple Music album links throughout the site
- Embedded Spotify album player
- Interactive lyrics for all seven songs
- Creative Commons attribution beneath each set of lyrics
- Links to the seven source memos
- An open-source music notice
- A **Build Canada: The Album (v2)** call for Canadian musicians, including submission instructions, dates and email links
- Responsive desktop and mobile layouts

## Preview it

Open `index.html` in a browser. For the most reliable local preview, run a small local server from this folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Editing content

Album data lives in `data.js`, including:

- Spotify and Apple Music URLs
- Track titles and topics
- Memo links
- Lyrics
- Gallery images and captions

The page structure and the v2 musician call live in `index.html`. The design lives in `styles.css`, and interactive behaviour lives in `script.js`.

## Put it online

The simplest deployment is Vercel Drop: drag this entire folder into Vercel Drop and publish. Because the project is only HTML, CSS and JavaScript, it needs no build command. You can connect a custom domain after it is live.

For ongoing edits, place the folder in a GitHub repository, import the repository into Vercel, choose **Other** as the framework preset, and leave the build command blank.

## Notes

- The embedded album player loads from Spotify when the page is online.
- The project contains web-optimized copies of the supplied photographs.
- Lyrics are reproduced as supplied and have not been copy-edited.


## Guitar chord sheets

The `assets/chords/` folder contains five two-page PDF chord sheets and their first-page preview images. The site marks **Build It Here** and **Make It Better** as coming soon.
