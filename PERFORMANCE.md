# Video performance (weekly review)

Updated every Monday morning by the scheduled task **"Trailbrief: weekly video review"**. It reads how each video did, logs the numbers in `analytics/metrics.json`, keeps the scoreboard below, and turns patterns that really hold into guidance in `STYLE.md` ("From the numbers").

This repo is public, so only platform numbers go here (views, likes, comments, shares, saves). Email sign-ups, sales and anything about customers never go in this repo; they appear only in Bryce's weekly note.

## Where the numbers come from
- Buffer's per-post metrics (`list_posts` / `get_post` with `includeMetrics`), for the posts Buffer published. Buffer refreshes them about once a day, so they can lag by up to ~24 hours.
- Each post is matched to a video by the Buffer IDs in `posted.json`, or else by the video link in the post (`videos/YYYY-MM/YYYY-MM-DD-slug.mp4`). Type and style come from the slot in the site repo's `tools/videos/calendar.json`; length from the video itself.
- Buffer gives counts, not watch time. Average % watched (the strongest signal for Shorts) lives only in YouTube Studio, TikTok Studio and Instagram Insights. If Bryce sends a screenshot of one, log it under the video in the scoreboard notes.

## How a video is scored
- A snapshot every Monday for every video posted 1–30 days ago (every metric field Buffer returns, plus `metricsUpdatedAt`).
- A video's score is its first snapshot taken when it was **7–13 days old** (the "7-day" number). Once set, it doesn't change. Videos under 7 days old are "early" and never used for conclusions.
- Per platform, never mixed (TikTok, Instagram and YouTube audiences behave differently):
  - **Views** (or plays; impressions or reach if Buffer has no views for that platform, and say which).
  - **Engagement rate** = (likes + comments + shares + saves) ÷ views, using whichever of those Buffer returns.
  - **Shares + saves per 1,000 views**: the clearest sign that people found the video worth keeping or passing on.
- Never invent or estimate a number Buffer didn't return. A missing metric is "n/a".

## When a pattern counts
- Groups compared: **style** (AI voice vs. text + music), **type** (story, permit, gear, mountains, safety, website), **length** (under 30 s vs. 30 s and up), and the hook or opening line when a clear difference stands out.
- A finding needs **all** of these:
  1. At least **3 scored videos in each group**.
  2. The group's **median** 7-day views **and** median engagement rate are at least **1.5×** the other group's.
  3. On at least **2 of the 3 platforms**.
- Medians, so one lucky or unlucky video can't decide anything. New accounts get tested on small audiences first, so views can swing 10× between videos for no clear reason.
- Short of that, the answer is "too early to call", and nothing changes.
- A single video doing far better or worse than the rest gets a short "why, maybe" note (hook, topic, first 2 seconds, length), clearly labeled a guess. It isn't a rule.

## What a finding can change
- It adds a dated line to **"From the numbers" in STYLE.md**, with the evidence (groups, counts, medians, platforms). Video runs use those lines for choices that are Claude's call: voice vs. text, the hook, length, pacing, how much map vs. photos.
- It never overrides Bryce's own feedback, the honesty rules or `AUTOMATION.md`: every fact sourced and independently checked, never salesy, AI labels, "trailbrief.app" in full, at least one website video a week, no fake numbers.
- Topic-mix changes (more of one type, less of another) are **suggestions for the next calendar batch**, listed in the findings log and in Bryce's note. The calendar itself only changes in a chat with Bryce.
- When a later review shows a finding stopped holding, mark it "no longer holds (date)" in both places.

## Scoreboard (7-day numbers)
| Posted | Video | Type | Style | Length | TikTok views | IG views | YT views | Eng. rate TT / IG / YT | Shares+saves per 1K TT / IG / YT | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| | *(none scored yet; first scores Mon Dec 7)* | | | | | | | | | |

## Findings log
- *(none yet)*
