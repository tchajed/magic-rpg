# Magic RPG

An RPG about being a wizard in a world full of magic, where you work for a company and want to get promoted.

## Motivation

The initial motivation behind this type of work was that while I like that interactive fiction allows for a rich story and world without the expense of fancy graphics assets, conveying the world state via repeated blocks of text per room and compass directions was tedious and unnecessary. It seemed natural to have the same richness afforded by text, but have gameplay that gave an actual map. Though a map seems useful in IF, it need not be as detailed as a traditional computer game would provide, so I settled on ASCII as a good middle ground, with the added bonus that it's easier to implement. At first I wanted to make the game a clone of Advance Wars, but on reflection that had two problems: war is quite serious and I didn't want to write anything serious, and the game itself is fairly involved (for example, a basic AI would be almost required). Eventually I hit on writing an RPG, a game format that actually feels natural to IF.

There were a few more general concepts I wanted to involve in a game/story. Many of my discarded ideas have been about economics, so incorporating that seemed like a good idea. This was the genesis of the news in the game, a tacked-on feature that describes this world as a crazy combination of lots of magic privitized and taken overly seriously. This was actually influenced by _Snow Crash_ by Neal Stephenson, in which countries are privitized. The news isn't important to gameplay in this RPG, but it does add a lot of flavor text.

In making an RPG I was also able to parody a lot of games I like in a way that was satisfying. I couldn't parody something I _really_ liked, but it also seemed like parodying something is giving it attention so I didn't want to lampoon something I didn't care about at all. This game parodies many of the standard tropes of RPGs along three dimensions:

1. How ridiculous the premise of these games is if you step back and think about it. The best example of this is Pokémon: you capture wild creatures and have them fight each other to be considered the best in the world at this sport.
2. The suspension of disbelief required for fantasy to work. Many fantasy worlds incorporate magic and fantastic elements that would have a profound effect on the world, even if each taken in isolation, but the world generally looks pretty much the same at a high level; this applies equally to non-interactive fiction. For example, the mere fact that you can open locks with magic in _Harry Potter_ would completely break physical security, and being able to lift things with magic must break conservation of energy or have some weird properties. This isn't hard to do in those works, but it's also fun to highlight them without suspending disbelief.
3. Standard game mechanics are used to drive the game in some direction. In tabletop RPGs these would all be considered railroading, a necessary feature in video games because computers aren't creative, and necessary to some extent even in the tabletop RPGs to avoid tedium (for example, if time moved linearly the game would be difficult, stressful, and/or annoying). Some of the tricks used in video games are just plain lazy: one that is incorporated in this work is a broken bridge that gets fixed due to the player doing something unrelated to advance the story.

## Development

Developing the game further revealed there were many potentially important decisions to be made that would affect how the basic idea was conveyed. What would the actual gameplay be? When and how was the overall story conveyed? What would enemies and battles be, given the world is realistic enough not to have monsters running around? How should the news be incorporated? What do the ASCII graphics convey, and how does the text support it?

Many of these decisions had to be decided by appealing to the simplest option, especially in the implementation. It turns out writing a game is both a significant work and surprisingly tricky to design conveniently! Focusing on only interactions with characters helped make a single implementation go far. Many gameplay mechanics I wanted could be implemented in their simplest form without incorporating menus and fancy input, restricting the implementation to a single command, interacting with a nearby object, which has no UI. Some of the writing tricks I wanted to do involved more state tracking then my system could make sane, so they had to be dropped: in particular, I wanted to comment on the player repeatedly talking to the same person, wandering around aimlessly, or waiting for a long time. It wasn't clear how to do this easily and comprehensively, and I wasn't sure how much it would add, so I dropped it.

I began to understand the value of short texts a bit late into the project; [robotfindskitten](http://robotfindskitten.org/play/robotfindskitten/) especially demonstrated this. Looking back, I envisioned chaining together large chunks of text, ideally some generated along the way to narrate what the player was doing. Even if this were implemented, in order to really provide the player feedback and incentivize them to explore the world, it would be helpful to have many short descriptions in the world, much like parser-based IF encourages. A good future direction would be to explore adding such short texts throughout the world, though still providing an ASCII representation at all times. It would be even better if the text could be made essential, for example by describing features not visible in the graphics. Even better would be for the text to more subtly indicate clues about what to do, replacing subtle visual hints a graphical video game would use. In games other than RPGs especially — I'm currently thinking platformers or strategy games — this would create an experience quite different from what a purely text-based IF could achieve.

## Technical Development

I made the mistake for a while of trying to use a web framework, thinking it would make some aspects of development and the dynamic UI easier. After unsuccessfully trying to learn and use [React](http://facebook.github.io/react/) and [Ember](http://emberjs.com/), I found that writing it myself was much better. I still use [virtual-dom](https://github.com/Matt-Esch/virtual-dom) to update the DOM, which was lightweight enough to be tolerable.

The text itself is also still written and generated by [Handlebars](http://handlebarsjs.com/) templates — this was a huge mistake. The text and game state machine are actually very tightly integrated: actions should impact what text is selected as well as updating the state. In practice Handlebars provides logic in the template, but not quite enough to be sane. The result is that I have a state machine consisting of `if...else` statements in Javascript, and something similar in Handlebars, with a bunch of helpers to make Handlebars work. It would have been much better to write my own library for managing a state machine with embedded HTML (perhaps several very small templates in a lightweight engine). This would allow me to 1) have everything in one place, 2) avoid interleaving logic and text as heavily, and 3) statically analyze the whole thing to ensure all property names were valid. My state machine was also not modular at all: everything for the game was in one file, with one namespace for state properties. I was able to split the Handlebars text, but this didn't really solve the problem of tying together independent parts of the game.

One of the tools I used turned out to be my best friend — [webpack](https://webpack.github.io/). Webpack gave me a live reloading page, transpiled code from ES6 (ECMAScript 2015) via [babel](https://babeljs.io/) with complete source maps, and could produce a static, minified production build as well, with only a small learning curve. Combined with the decision to implement persistent saves in the browser right away, this made development fairly convenient.

## Parodies

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

- Shops all over the place somehow get by fine — where do they get their business from?
- Enemies randomly drop things, including money
- Enemies respawn automatically upon leaving an area and returning
- NPCs happily repeat themselves every time you talk to them

--------

Written as a final electronic literature project for [CMS.845 (Interactive Narrative)](http://www.nickm.com/classes/interactive_narrative/2016_spring/).
