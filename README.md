# Magic RPG

An RPG about being a wizard in a world full of magic, where you work for a company and want to get promoted.

## Motivation

The initial motivation behind this type of work was that while I like that interactive fiction allows for a rich story and world without the expense of fancy graphics assets, conveying the world state via repeated blocks of text per room and compass directions was tedious and unnecessary. It seemed natural to have the same richness afforded by text, but have gameplay that gave an actual map. Though a map seems useful in IF, it need not be as detailed as a traditional computer game would provide, so I settled on ASCII as a good middle ground, with the added bonus that it's easier to implement. At first I wanted to make the game a clone of Advance Wars, but on reflection that had two problems: war is quite serious and I didn't want to write anything serious, and the game itself is fairly involved (for example, a basic AI would be almost required). Eventually I hit on writing an RPG, a game format that actually feels natural to IF.

There were a few more general concepts I wanted to involve in a game/story. Many of my discarded ideas have been about economics, so incorporating that seemed like a good idea. This was the genesis of the news in the game, a tacked-on feature that describes this world as a crazy combination of lots of magic privitized and taken overly seriously. This was actually influenced by _Snow Crash_ by Neal Stephenson, in which countries are privitized. The news isn't important to gameplay in this RPG, but it does add a lot of flavor text.

In making an RPG I was also able to parody a lot of games I like in a way that was satisfying. I couldn't parody something I _really_ liked, but it also seemed like parodying something is giving it attention so I didn't want to lampoon something I didn't care about at all. This game parodies many of the standard tropes of RPGs along three dimensions:

1. How ridiculous the premise of these games is if you step back and think about it. The best example of this is Pokémon: you capture wild creatures and have them fight each other to be considered the best in the world at this sport.
2. The suspension of disbelief required for fantasy to work. Many fantasy worlds incorporate magic and fantastic elements that would have a profound effect on the world, even if each taken in isolation, but the world generally looks pretty much the same at a high level; this applies equally to non-interactive fiction. For example, the mere fact that you can open locks with magic in _Harry Potter_ would completely break physical security, and being able to lift things with magic must break conservation of energy or have some weird properties. This isn't hard to do in those works, but it's also fun to highlight them without suspending disbelief.
3. Standard game mechanics are used to drive the game in some direction. In tabletop RPGs these would all be considered railroading, a necessary feature in video games because computers aren't creative, and necessary to some extent even in the tabletop RPGs to avoid tedium (for example, if time moved linearly the game would be difficult, stressful, and/or annoying). Some of the tricks used in video games are just plain lazy: one that is incorporated in this work is a broken bridge that gets fixed due to the player doing something unrelated to advance the story.

## References

Some of the parodies made by the game include:

- The use of `@` to refer to your player is in the tradition of Nethack.
- Controls are explained in-game.
- The protagonist doesn't speak (_Pokemon_, _The Legend of Zelda_), even when they would be expected to.
- "Bosses" as well-defined significant enemies, here punned to boss in the corporate sense.
- "Grinding" to be able to beat bosses.
- Everyone you meet is happy to talk to you, and many are super helpful.
- Some "broken bridge" getting fixed by completing a story-advancing quest.
- Fetch quests, especially delivering mail for people (an actual side-quest in _Paper Mario_).
- The theme being to save the world (even _Pokemon Ruby/Sapphire_ have you save the world along the way).

Some aspects I wanted to parody but didn't manage to incorporate include:

- Shops all over the place somehow get by fine --- where do they get their business from?
- Enemies randomly drop things, including money
- Enemies respawn automatically upon leaving an area and returning
- NPCs happily repeat themselves every time you talk to them

## Why do this?

Written as a final electronic literature project for [CMS.845 (Interactive Narrative)](http://www.nickm.com/classes/interactive_narrative/2016_spring/).
