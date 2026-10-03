# Vellum Academy (formerly Marginalia)

> **Tactile Knowledge for Modern Engineers.**  
> A free, open-license study library covering **AI & Machine Learning**, **Cybersecurity**, and the **Internet of Things (IoT)** from mathematical first principles to production systems.

---

## 📖 Welcome, Student! (How This App Works)

If you are new to React and Next.js, here is a quick map of how everything connects:

* **No Database Needed**: All course content lives in clean files right in this repository:
  * Course chapters & study notes: `content/`
  * Curated, ranked YouTube videos: `data/videos/`
  * Open-source legal ledger: `content/LICENSES.json`
* **Your Progress is Saved Locally**: When you take quizzes or earn chapter completion stamps, your progress is saved automatically in your browser's `localStorage` (`codex_student_state_v1`). You never need to sign up or create an account.
* **Three Part Chapters**:
  1. **Watch**: Top-ranked, verified video explanations.
  2. **Read**: Peer-reviewed notes with 7 mandatory sections, runnable code, and cheat sheets.
  3. **Practice**: Original scenario quizzes. Scoring $\ge 70\%$ unlocks a rubber-drawn chapter verification stamp.

---

## 🚀 Quick Setup (Run on Localhost)

### 1. Requirements
* [Node.js](https://nodejs.org/) version 18.18 or higher (Node 20+ recommended).
* Terminal / command prompt (PowerShell, Bash, or Zsh).

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

Now open **[http://localhost:3000](http://localhost:3000)** in your browser!

---

## 🔑 Environment Variables (`.env.local`)

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `YOUTUBE_API_KEY` | *(Optional)* Your YouTube Data API v3 key from Google Cloud Console. If left blank, Vellum runs in **Sample Data Mode**, using pre-verified reference lectures without failing. |

---

## 🛠️ How-To Guides

### How to Add a New Chapter
1. Open `src/lib/courses-data.ts`.
2. Locate the course array (`ai-ml`, `cybersecurity`, or `iot`).
3. Add a chapter entry specifying title, estimated hours, tier (`Beginner` / `Intermediate` / `Advanced`), volatility tag (`evergreen` / `moderate` / `fast-moving`), and prerequisites.
4. Create the folder `content/<course-slug>/<chapter-slug>/`.
5. Add `notes.mdx` following the 7 mandatory sections (see `CONTENT_RULES.md`).
6. Add `quiz.json` with 8–10 questions.
7. Add verified video data to `data/videos/<course-slug>.json`.

### How to Tune the Video Ranking Weights
Edit `data/videos/ranking.config.json`:
```json
{
  "weights": {
    "engagement": 0.25,
    "traction": 0.15,
    "authority": 0.25,
    "freshness": 0.15,
    "syllabusFit": 0.20
  },
  "dethroningThreshold": 1.12
}
```
* **Dethroning Threshold**: A new video must beat the current #1 by at least 12% across two consecutive runs before dethroning it.
* **Allow List**: Add trusted educational YouTube channel names under `channelAllowList`.

### How to Run Video Refresh Locally
```bash
npm run refresh:videos
```

---

## 🚢 How to Deploy to Vercel (100% Free)

1. Push this repository to your GitHub account.
2. Go to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Select your repository.
4. *(Optional)* Add your `YOUTUBE_API_KEY` in the Environment Variables section.
5. Click **Deploy**. Vercel will build and host your site globally with zero server fees.

---

## 📜 Documentation & Specifications

* [`ARCHITECTURE.md`](./ARCHITECTURE.md): System design, directory overview, YouTube API quota budget.
* [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md): Typography, CSS variable tokens, pencil cursor mechanics.
* [`CONTENT_RULES.md`](./CONTENT_RULES.md): Open-source legal licensing, note structure, defensive quiz guidelines.
