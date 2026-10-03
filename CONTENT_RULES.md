# Content & Editorial Rules: Legal, Pedagogical & Verification Standards

## 1. Legal & Intellectual Property Charter

To ensure 100% legal compliance, safety, and ethical integrity:
1. **Permissible Sources**:
   - **Original Authorial Synthesis**: Clear, intuitive explanations crafted from first principles in conversational yet mathematically precise English.
   - **Permissive Open-Source & Public Domain Materials**:
     - Creative Commons: `CC0`, `CC BY 4.0`, `CC BY-SA 4.0`.
     - Permissive Software Licenses: `MIT`, `Apache 2.0`, `BSD-3-Clause` (e.g. documentation from scikit-learn, PyTorch).
     - Public Domain Government & Standard Publications: NIST Special Publications (NIST SP 800-series), RFCs (IETF), OASIS Open Standards (MQTT specs).
     - Open Curricula: OpenStax, *Dive into Deep Learning* (D2L), Wikibooks, OWASP Foundation documentation.
2. **Strictly Prohibited Materials**:
   - **NO** copyrighted textbooks (e.g., Pearson, O'Reilly, McGraw-Hill).
   - **NO** copying from paid course platforms (Coursera, Udemy, edX).
   - **NO** verbatim copying of blog posts, Medium articles, or Substack essays.
   - **NO** transcription of YouTube video audio.
   - **NO** `CC BY-NC` (Non-Commercial) or `CC BY-ND` (No Derivatives) text insertion. If an NC/ND resource is exceptional, we link out in "Further Reading" without embedding text.
3. **Audit Trail & Frontmatter**:
   - Every `notes.mdx` file must conclude with an explicit **Sources & License** block.
   - Every `notes.mdx` file must declare `reviewed: false` in its YAML frontmatter until manually signed off by the curriculum lead.
   - Every external reference is logged into `content/LICENSES.json`.

---

## 2. Note Structure Specification (7 Mandatory Sections)

Every chapter note (`content/<course>/<chapter>/notes.mdx`) must implement all 7 sections in strict sequence:

1. **Why It Matters**: The human, industrial, and engineering stakes. Why should an engineer care? What breaks in production if this concept is misunderstood?
2. **Core Ideas in Plain English**: Visual intuition first, formal definitions second. Uses the "Study Notebook" tone—clear analogies, marginal asides, hand-drawn SVG diagrams.
3. **Worked Example**: A concrete, fully runnable code snippet (Python, C/C++, Bash, or Node) with zero omitted imports or pseudo-code handwaving.
4. **Common Mistakes & Pitfalls**: 3–4 classic failure modes, misconceptions, or compiler/runtime traps that junior engineers stumble into.
5. **Cheat Sheet**: High-density reference summary (ASCII table, command flags, mathematical identities, or pinouts) designed for rapid exam/interview recall.
6. **Further Reading**: Curated links to official documentation, primary RFCs/papers, and open-access research.
7. **Sources & License Ledger**: Explicit citation with Author, Organization, Resource Title, Canonical URL, License Type, and Access Timestamp.

---

## 3. Video Pipeline & Scoring Engine Specification

### API Constraints & Data Integrity
- **Zero Hallucination Guarantee**: All video IDs, titles, channel names, and durations are acquired directly via the YouTube Data API v3.
- If `YOUTUBE_API_KEY` is absent, the system runs in `SAMPLE_MODE`, using a curated static manifest clearly badged as sample data.

### 5-Factor Ranking Algorithm
Each candidate video evaluated by `scripts/refresh-videos.mjs` is assigned a normalized score $S \in [0, 1]$:

$$S = w_e \cdot E + w_t \cdot T + w_a \cdot A + w_f \cdot F + w_s \cdot S_{\text{fit}}$$

Where:
1. **Engagement Quality ($E$)**:
   $$E = \frac{\text{likes} + 10}{\text{views} + 1,000}$$
   Smoothed Laplace estimator preventing low-view outlier videos from gaming the ratio.
2. **Traction ($T$)**:
   $$T = \min\left(1.0, \frac{\log_{10}(\text{viewsPerDay} + 1)}{6.0}\right)$$
   Log-scaled velocity assessing current algorithmic momentum.
3. **Channel Authority ($A$)**:
   Boost multiplier for verified educator allow-lists (e.g. 3Blue1Brown, StatQuest, Computerphile, Andreas Kling, NetworkChuck, Phil's Lab) combined with logarithmic subscriber weighting.
4. **Freshness ($F$)**:
   $$F = e^{-\lambda \cdot \Delta t}$$
   Where $\Delta t$ is days since publication, and decay rate $\lambda$ is dictated by the chapter's volatility tag:
   - `evergreen` (e.g., Math for ML, Ohm's law): $\lambda = 0.0003$ (half-life $\approx 6$ years)
   - `moderate` (e.g., Linux command line, Scikit-learn): $\lambda = 0.0010$ (half-life $\approx 2$ years)
   - `fast-moving` (e.g., LLMs, DevSecOps, Cloud): $\lambda = 0.0035$ (half-life $\approx 7$ months)
5. **Syllabus Fit ($S_{\text{fit}}$)**:
   - Keyword coverage ratio against the chapter's mandatory search recipe.
   - Penalty for videos shorter than 4 minutes or longer than 90 minutes unless tagged as deep-dive lectures.
   - Bonus for verified English captions (`hasCaptions === true`).

### Dethroning & Hysteresis Rule
To eliminate annoying flip-flops:
- A new challenger replaces the reigning `#1 Top Pick` **only if** $S_{\text{challenger}} \ge 1.12 \times S_{\text{incumbent}}$ across **two consecutive automated runs**.
- When dethroned, the old #1 slides smoothly to #2; maximum 5 videos per chapter are retained.
- Manual overrides (`pinnedVideoIds` and `blockedVideoIds` in `ranking.config.json`) take ultimate precedence.
- Every shift is logged to `data/videos/changelog.json` with a human-readable justification.

---

## 4. Quiz Design & Ethical Safety Rules

1. **Volume & Composition**: 8 to 10 questions per chapter in `quiz.json`:
   - 60% Single-choice conceptual questions testing deep mechanics (not trivia).
   - 20% Multi-select syntax/protocol questions.
   - 20% Scenario-based debugging problems ("A system displays error X under load Y. Which configuration resolves this?").
2. **Defensive Cybersecurity Mandate**:
   - All cybersecurity questions and notes must adhere to **defensive, ethical, and sanctioned lab environments** (e.g., TryHackMe, HackTheBox, OWASP Juice Shop).
   - Never provide offensive attack weaponization scripts or real-world targeting techniques.
3. **Pedagogical Feedback**:
   - Every answer option includes an insightful 1–3 sentence rationale explaining *why* it is right or wrong, referencing the exact subsection of the chapter's notes.
