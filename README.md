# Imperfect Servant Podcast - Website

Official placeholder website for the **Imperfect Servant Podcast** ("*Not Perfect. Just Willing.*"), designed for hosting directly on **GitHub Pages**.

## Features

- **Interactive Graphic Hotspots**: Proportional, responsive hotspots directly over the title screen artwork icons:
  - **YouTube** (`@imperfectservantpodcast`)
  - **Spotify**
  - **Apple Podcasts**
  - **iHeartRadio**
  - **Social Handle** (`@imperfectservantpodcast`)
  - **Email Text & Envelope Icon** (`imperfectservantpodcast@gmail.com`) with instant clipboard copy & `mailto:` integration
  - **Scripture Spotlight**: Interactive modal for **Romans 14:14** and **Leviticus 3:16**
  - **The 4 Pillars**: Interactive details for *Improving Health*, *Strengthening Faith*, *Growth Through Christ*, and *Finding Your Purpose*
- **Responsive Mobile Platform Bar**: Dedicated, touch-friendly platform cards for mobile screens with minimum 48px tap targets.
- **Trailer Teaser Player**: Ambient gold soundwave player for upcoming episode teasers.
- **Zero Build Dependencies**: Pure HTML5, CSS3, and JavaScript — ready for instant GitHub Pages deployment.

---

## How to Host on GitHub Pages

1. **Push this repository to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Imperfect Servant Podcast website"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub.
   - Click **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment** > **Branch**, select `main` and folder `/(root)`.
   - Click **Save**.
   - Your website will be live in ~1-2 minutes at:  
     `https://<your-username>.github.io/<your-repo-name>/`

3. *(Optional)* **Custom Domain**:
   - If you purchase a custom domain (e.g. `imperfectservantpodcast.com`), enter it under **Custom domain** in the GitHub Pages settings and add the corresponding DNS CNAME/A records.

---

## How to Update Links

All social and podcast links are located directly in [index.html](index.html):
- **YouTube**: `https://www.youtube.com/@imperfectservantpodcast`
- **Spotify**: `https://open.spotify.com/show/0347HogZFHvFF3vYagjIBq`
- **Apple Podcasts**: `https://podcasts.apple.com/us/podcast/imperfect-servant-podcast/id6802761640`
- **iHeartRadio**: `https://www.iheart.com/podcast/269-imperfect-servant-podcast-341580091`
- **Email**: `imperfectservantpodcast@gmail.com`
