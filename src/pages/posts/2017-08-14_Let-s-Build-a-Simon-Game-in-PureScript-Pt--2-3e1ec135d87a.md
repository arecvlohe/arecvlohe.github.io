---
title: "Let’s Build a Simon Game in PureScript Pt. 2"
description: "Functional Programming the Front End with PureScript and Pux"
publishDate: '2017-08-14'
layout: ../../layouts/BlogPost.astro
---

To summarize, in the [last post](https://medium.com/@arecvlohe/lets-build-a-simon-game-in-purescript-pt-1-b9fa587a11dd) you were able to create a simple program that creates a series of 20 random integers between 1 and 4 🔢. In the process you learned how to: install modules using `bower`, use the `pulp` build tool, handle side-effects using the `Control.Monad.Eff`, serve up an application using `pulp server`, and much more!

In this post, you will build on that knowledge and work on the view layer to the application. You will pull in the [smolder](https://pursuit.purescript.org/packages/purescript-smolder/10.1.0) library which provides helpers to generate HTML markup. I will not cover any styling in this post, so I leave that up to you to work on 😎.

### Update the Rando Function 💁

Before I move forward I want you to put a finishing touch on the function you created last time. The `generateRandoSequence` does nothing more than generate a random sequence of integers. Although this is nice, it doesn’t really help further along the app you are building. Instead, what is needed is a random list of strings: red, green, blue, yellow. These are same colors the actual Simon Game uses. To do this I will map the random list of numbers to their corresponding color inside a simple `case` statement.

generateRandoSequence ::
  ∀ eff. Eff (random :: RANDOM | eff) (List String)
generateRandoSequence = do
  result <- replicateA 20 (randomInt 1 4)
  pure $ map (\\v ->
    case v of
      1 -> "red"
      2 -> "yellow"
      3 -> "green"
      4 -> "blue"
      \_ -> "Oh nose 👃"
  ) result

This may look familiar to you with just a few small changes. The `<-` represents assignment inside of a `do` block. The function `pure` represents the return of a computation that has side-effects, such as `result` above it. The `$` in this context represents the [apply](https://pursuit.purescript.org/packages/purescript-prelude/3.1.0/docs/Control.Apply#t:Apply) function. You handle each integer in the `case` expression and just-in-case you don’t get a value between 1 and 4, you will return “Oh nose 👃.” This can be cleaned up a little and maybe, just maybe, more readable. How does this look:

generateRandoSequence ::
  ∀ eff. Eff (random :: RANDOM | eff) (List String)
generateRandoSequence =
  map (\\v ->
    case v of
      1 -> "red"
      2 -> "yellow"
      3 -> "green"
      4 -> "blue"
      \_ -> "Oh nose"
  ) <$> replicateA 20 (randomInt 1 4)

The `do` block was removed and `<$>` was added. In this instance, the `<$>` represents the [map](https://pursuit.purescript.org/packages/purescript-prelude/3.1.0/docs/Data.Functor#v:%28%3C$%3E%29) function. But in this particular case, you are applying a function to a higher-kinded type, the Eff monad. What gets returned is `List Int` which has its own [map](https://pursuit.purescript.org/packages/purescript-prelude/3.1.0/docs/Data.Functor#t:Functor) function, for mapping over a list of values. How about one more?

generateRandoSequence ::
  ∀ eff. Eff (random :: RANDOM | eff) (List String)
generateRandoSequence =
  replicateA 20 (randomInt 1 4) <#>
  map (\\v ->
    case v of
      1 -> "red"
      2 -> "yellow"
      3 -> "green"
      4 -> "blue"
      \_ -> "Oh nose"
  )

In this case, I removed the `<$>` and added `<#>` which is the opposite of `<$>`. I think this is the most readable type but you may differ. That is perfectly fine. The reason for showing three examples was: (1) to show the flexibility and expressiveness of the language, and (2) introduce you to the plethora of operators at your disposal. I didn’t want to hold back just because you might be new 😉. When you run `pulp run` you should see a random list of strings in the terminal 🎉.

I hope I didn’t lose you up to this point! That last part was a doozy but hopefully, you will see the light soon 💡. Now let’s move on to markup. Markup is not that bad, right? You will find out!

### Markup In PureScript with Smolder ⟨∕⟩

In order to use the smolder library with its helpful handlers for generating markup you will need to install it as a dependency.

bower install --save purescript-smolder

Also, create a directory inside `src` that will house all the applications features. Call it `App` to be original. Then inside of `App` create a file called `View.purs`. At the top of each file is where you declare your module as well as any other imports you need.

module App.View
  ( view
  ) where

import Prelude hiding (div)

import Text.Smolder.Markup (Markup, text)
import Text.Smolder.HTML (div)

It’s common practice to: (1) name functions you are exporting from a module, in this case `view`; and (2) import `Prelude` and all its helpers. In this case, there is naming conflict with the `div` in `Prelude` and the `div` in the smolder library. To remove this conflict you can `hide` the one from `Prelude` so that it does not come into scope. As most projects start, we need to do a “Hello, Something!”

view :: ∀ e. Markup e
view =
  div
    $ text "Hello, PureScript!"

In this function, there is a `div` with `text`. Simple enough, right? Now that the function is created, let’s run it inside of our main function and `render` our markup to the DOM.

### Bumpy Road Ahead 🚧

There is a lot going on in this next section so I just want to prepare you for the fact you might see some things you may not understand 😤. Still ready to move forward? Okay, let’s go!

To move forward you will need a few more libraries:

bower install --save purescript-dom purescript-smolder-dom purescript-foldable-traversable

Then you will add the needed functions from those libraries as well as the module you just created.

import App.View (view)
import Data.Foldable (for\_)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Types (htmlDocumentToNonElementParentNode)
import DOM.HTML.Window (document)
import DOM.Node.NonElementParentNode (getElementById)
import DOM.Node.Types (ElementId(..))
import Text.Smolder.Renderer.DOM (render)

This took me a few hours perusing [Pursuit](http://pursuit.purescript.org) to figure out how to work with the DOM 😮. Long story short, there are a few hoops to jump through to make sure you have the right types. In many ways, you work with the DOM in the same way you would in JavaScript. But with the type definitions, it’s a little tricky. First, to get this working you will need to add a `div` to the `body` of your `index.html`.

<div id="app"></div>

This will be the `div` that you attach your `view` too. But how do you actually gain access to that `div` that is in the DOM? Good question. First, you need access to the `document` object, which we will get through the `window`.

documentType <- document =<< window

Another operator 🤙. Yay! The `=<<` is known as the [bind](https://pursuit.purescript.org/packages/purescript-prelude/3.1.0/docs/Control.Bind#t:Bind) operator. It takes a computation and gives it to the next function in the sequence. In this case, the function `window` returns the `Window` type which binds to the `document` function. The `document` function, given a `window` of `Window` type, returns a `document` of `HTMLDocument` type that I assign to the variable `documentType`. Now that we have the `HTMLDocument` we can call the function `getElementById` in a not so terse way.

element <- getElementById (ElementId "app") $ htmlDocumentToNonElementParentNode documentType

There is a lot going on here. Suffice it to say it returns a `Maybe Element` as a return type. Almost to the finish line 🏁. Let’s now render the `view` function and attach it to the `element` in the DOM.

for\_ element (render <@> view)

A new operator and function 🙌! Because `element` is of type `Maybe Element` you can use [for\_](https://pursuit.purescript.org/packages/purescript-foldable-traversable/3.4.0/docs/Data.Foldable#v:for_) to map over the `Maybe` applicative and apply a function. In this case, you are applying the `render` function from smolder. The `<@>` operator is kind of an alias for a common [flip](https://pursuit.purescript.org/packages/purescript-prelude/3.1.0/docs/Data.Function#v:flip) function that you will find in other functional libraries. In this case, however, this operator is an actual alias for a function called [flap](https://pursuit.purescript.org/packages/purescript-prelude/3.1.0/docs/Data.Functor#v:flap), a generalization of flip. That’s a lot of flippy-flap 😂. The reason you need to flap the arguments is that `render` is expecting the `Maybe Element` type as the first argument, with `view` being the second. That’s enough flippy-flap for today 🤣. Okay, I will stop. All together now!

> Notice that I add `DOM` to the main signature.

main :: forall e. Eff (console :: CONSOLE, random :: RANDOM, dom :: DOM | e) Unit
main = do
  documentType <- document =<< window
  element <- getElementById (ElementId "app") $ htmlDocumentToNonElementParentNode documentType
  for\_ element (render <@> view)

If you run `pulp server`, when you navigate to `localhost:1337` in the browser you should see `Hello, PureScript!`. Awesome sauce!

> Remember that trying to run `pulp run` on the current setup will cause an error as node has no such notion of a `window`.

### Summary ✅

In this lesson you learned:

*   What the bind `=<<` operator is
*   What the flap`<$>` operator does
*   How to interact with the DOM
*   How to create markup using smolder
*   How to create a module and expose functions
*   How to hide a function
*   How to map over a list

What you didn’t learn

*   What the `Markup` type is
*   Why does `htmlDocumentToNonElementParentNode` exist
*   What is the`ElementId` type instance
*   What is all this applicative functor mumbo jumbo
*   What is the `DOM` effect type and what does it do

The things that I did not cover would be good for independent study. I recommend looking at the book [PureScript by Example](https://leanpub.com/purescript/read) as well as the [PureScript Documentation](https://github.com/purescript/documentation) to get some background if you haven’t done so already. Also, check out all the library document on [Pursuit](https://pursuit.purescript.org/). If you have any questions check out the [Slack](https://fpchat-invite.herokuapp.com/) or [Gitter](https://gitter.im/purescript/purescript) channels. Until next time, keep hacking!

Part 2 of this project is tagged and can be found on Github here:

[**arecvlohe/ps-medium-simon-game**
_Contribute to ps-medium-simon-game development by creating an account on GitHub._github.com](https://github.com/arecvlohe/ps-medium-simon-game/tree/part_2 "https://github.com/arecvlohe/ps-medium-simon-game/tree/part_2")[](https://github.com/arecvlohe/ps-medium-simon-game/tree/part_2)

> Full Disclosure: I got a lot of help and support from the community to write this post. I strongly encourage any and all who have questions to join the Slack or Gitter channels as the community is very welcoming.

#### [Continue on to Part 3](https://medium.com/@arecvlohe/lets-build-a-simon-game-in-purescript-pt-3-a4c754780608)
