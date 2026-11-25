# Trailbrief video style guide (Bryce's feedback, kept up to date)

Every video run reads this file before making anything, and **adds new feedback from Bryce the same day** (date + what he said + the rule it becomes). The goal, in Bryce's words: over time, he shouldn't need to give feedback much.

## Rules so far
**Content**
- **Goal: entertaining videos that make people follow (Bryce, Nov 25).** A bigger audience is what brings memberships, so pick the story most hikers and climbers would stop scrolling for. Topics don't have to be permits or U.S. trips: Seven Summits, K2, Everest, famous climbs and mountain history are all in.
- At least 4 posts a week (Bryce, Nov 25). If a week's calendar has fewer, add a story slot.
- Most videos are informative or entertaining (gear, mountains, trails, history, permits explained), not ads. At least one video a week is about the website. On the others, the Trailbrief tag at the end is 1–2 seconds and optional.
- Make it relevant to most hikers, not a narrow niche. Never salesy. (The deleted Wave ad was "too salesy, not applicable to a lot of people, and no sound".)
- Every video has sound: an AI voice or original music, usually both.
- Style per video is Claude's call (AI voice vs. on-screen text + music): whichever will perform better. Reference account: Guildshore (narrated, story-first breakdowns).
- Facts: official/primary sources only, plus an independent check (see AUTOMATION.md). "Absolutely no factual mistakes."

**Visuals**
- Real photos beat pure animation, but **every photo must show what the voice is saying at that moment**: a named peak, the actual summit, the actual trail. Generic pretty mountains "look like nothing". Put a label on each photo that ties it to the line ("King's peak", "The real summit").
- Between photos, the **animated map/diagram carries the explanation**. Give it real screen time (routes, arrows, labels, crosshairs), not a few seconds.
- **Transitions must be smooth**: slow crossfades (about 0.5 s) between photo and map, a steady slow zoom, no dip to black/plum and no sudden zoom changes. (v2 of the Whitney video felt "clicky and glitchy".)
- Photo credit + year on screen, small, bottom-left. Historic photos are labeled with their year.
- No recognizable faces (Bryce included).

**Photos**
- Library: `library/photos/` (NPS/USGS public domain) and `library/photos/trailbrief/` (Bryce's own photos from his Aug 2023 Whitney trip). Rights and notes: `library/CREDITS.md`.
- **Photos are optional; don't pick topics by what the library has (Bryce, Nov 25).** When a video needs new photos, search public-domain sources (NPS, USGS, NASA, Library of Congress) yourself. The cloud workspace can't download from those sites (tested Nov 25: npgallery, nps.gov, usgs.gov, wikimedia, loc.gov blocked; NASA's image server errored), so if a photo can't be fetched in the run, let the animation carry the video and list the photos you'd add for Bryce. New downloads through his Mac come as one bundled file, never one Save prompt per photo.

**Captions and hashtags**
- Every post gets hashtags, **visible without tapping "more"**: Instagram: a one-line hook, then **at most 5 hashtags** on the next line (Instagram's hard cap since Dec 2025, caption and comments combined), then the details. TikTok: a short caption with the hook and hashtags in the first lines. YouTube: "#shorts" in the title and 3 hashtags at the end of the description (YouTube shows those above the title).
- Mix broad and specific tags: the place (#mountwhitney, #easternsierra), the activity (#hiking, #backpacking), the topic (#hikinghistory, #permits). No banned or bait tags (#fyp, #viral).

**Process**
- For the first few videos, Bryce approves each video before anything goes to Buffer.
- **When Bryce approves in the run's chat ("post it"), schedule the posts in Buffer for the slot's time (not drafts)** so they go out without him opening Buffer (Bryce, Nov 25).
- **Post time: 11:00 AM ET on the slot's date (Bryce, Nov 25), not 7 PM.** calendar.json and AUTOMATION.md still say 19:00; this wins. If he approves after 11 AM, schedule it 15 minutes after his approval and say so.

**From the numbers** (added by the Monday performance review; evidence in `PERFORMANCE.md`)
- These are leanings from real results. Use them for choices that are Claude's call (voice vs. text, hook, length, pacing). They never override Bryce's feedback above or the rules in AUTOMATION.md.
- *(none yet: the first videos get scored Mon Dec 7, and a pattern needs 3+ videos per group)*

## Feedback log
- **2026-11-23, Whitney test v1** (all animation): "a little confused why there's no real photos and it's all AI" → use real photos.
- **2026-11-23, Whitney v2** (5 NPS photos): "photos might be too much… when you change from photo to photo it's too clicky and glitches a little… spend some time on the diagram in between photos and make the photo choices a little better"; "I want the photos more related to what you're saying… they kinda just looked like nothing" → narration-matched photos with labels, longer map sections, crossfades.
- **2026-11-23, Whitney drafts:** "these should have hashtags… I don't see hashtags on the Whitney vid" (they were at the end of a long caption, hidden behind "more"; YouTube had none) → hashtags near the top on Instagram/TikTok, 3 in the YouTube description. Then: "Instagram only allows 5 hashtags per post" → Instagram max 5, the most specific ones.
- **2026-11-23, general:** expects lots of feedback on the first few videos; wants it saved so future runs need him less → this file + Claude memory.
- **2026-11-25, post time:** "i thing 7pm is too late i think it needs to be 11am fo al tasks" → posts go out at 11:00 AM ET.
- **2026-11-25, posting:** approved the Grand Canyon video with "post now", then "schedule for 3pm", then "when i approve in here auto schudule it" → after approval in chat, schedule the posts (no drafts to post by hand). Default time stays 7 PM ET unless he names one.
- **2026-11-25, extra video:** "i need to post 4x a week so right here craft a story video" (no calendar slot on Tue Nov 24 or Wed Nov 25) → at least 4 posts a week; extra story slot made the same day (Grand Canyon $1 toll).
- **2026-11-25, photos:** "dont need photos you can search for new photos if you need" → photos optional; search for public-domain ones when a video needs them; don't limit topics to the library.
- **2026-11-25, direction:** "these need to be entertaining and make ppl follow, i think the memberships will come with a bigger audience, so its ok to make videos not related to the spacific things on the permit like a 7 summits video, k2, etc" → goal is follows; broad mountain/climbing stories are in (rule at the top of Content).
- **2026-11-23, performance:** asked whether video performance would be analyzed "so you can see which ones do well and which ones do bad so you can improve" → weekly Monday review (`PERFORMANCE.md`), findings feed "From the numbers" above.
