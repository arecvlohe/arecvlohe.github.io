---
title: "Let’s Build a Random Quote Machine in Elm"
publishDate: '2017-04-23'
layout: ../../layouts/BlogPost.astro
---

### Objectives

*   Learn about and implement the Elm architecture using messages, command messages, types, type aliases, and other related concepts.
*   Demonstrate how to utilize Elm community packages.
*   Create a simple Random Quote Machine using Ellie, the friendly Elm editor.

### Editor

*   [Ellie](https://ellie-app.com/new)

### Resources

*   [Elm Docs](http://package.elm-lang.org/)

Elm is a functional programming language that compiles down to JavaScript. From my very little experience in using it thus far, it is a real joy, especially once you grasp the way data flows throughout the program. In this lesson, we will create a simple Random Quote Machine while highlighting the core concepts of the Elm architecture.

To begin let’s open up the friendly Elm editor, [Ellie](https://ellie-app.com/new), in the browser of your choice.

What I like to do first is create a model that describes the shape of the data that I want to display in the browser. I want to display an author name and the author’s quote. In programmatic form it will look like this:

You probably notice `type alias` and are 🤔. A `type alias` describes a data set. Here I have an object that has keys author and quote, both as `String` data types. You have worked with data types before such as `String`, `Bool`, `List`, `Array`. `Type aliase`s just allow you to extend the functionality of types to ensure that the data you pass around in your program is what you expected it to be. Just as in JavaScript you can’t call `Number(5).slice(1)` so too in Elm you cannot render the `view` without the correct model in place. If you wrote the above code in the Ellie editor and compile it, everything should still work as expected.

Now that I have the model `type alias` I will now create the `model` function. For now, it won’t do much except provide me with a default author and quote for me to render in the `view`. It will look a little something like this:

What is `model: Model`? All this is saying is that my `model` function returns a `Model` type which I described using the `type alias`. This is known as a _function signature_ and it is quite helpful when trying to understand what a function is doing.

Now that I have the `model` let’s render a `view` with it. I will now create a `view` function that takes our `model` and then renders the author and quote. Pretty simple, huh? It will look a little something like this:

Again, I have a `view` function that takes a `model` and returns `Html`. It actually says `Html Msg` but I won’t be needing the `Msg` part till later. Because I am using Elm’s `Html.beginnerProgram` I will need an `update` function even though I am not using it at this point. For now, it’s not going to be doing very much.

Since I am just rendering the `model` in the `view` I am not doing anything special in the update. I created a `Msg` type of `NoOp`, no operation, so that I can have the correct function signature for the `update` function that `Html.beginnerProgram` expects.

To put it all together I am using the `Html.beginnerProgram` that I spoke of before. This wires everything up and makes our app come alive 😱!

If you did everything above and you hit “COMPILE” in the top left of the browser.

We have come a long way. Here is what the code looks like so far:

At this point, we have a quote that’s not random. You came to see a random quote machine. You must be so disappointed!

First I will create a list of quotes based on the `type alias` `Model` I made at the very beginning. I will call this function `quotes`.

What I have here is a `List` of `Model`s. `List` is another data type in Elm. `List`s are very similar to `Array`s with some optimizations. From this list, we will randomly choose a quote. Now I can get into messages and how I will use messages to generate a random number and from that number pull a quote from the `quotes` `List`.

The first message type I will create is called `FetchQuote`. It will kick off the process of generating a random number. The other message type I need is `NewQuote` which will take an `Int` as a data type. These message types will look a little something like this:

What `FetchQuote` will do is create a `Cmd Msg`. `Cmd Msg`, or command message, is how the Elm architecture handles side-effects. Let’s see this in action in our `update` function.

I have just added a crazy amount of new stuff and now you are probably going to walk away and never read this post again, but hear me out! The `update` function now takes a `Msg` and a `Model` and returns a tuple of `Model` and `Cmg Msg`. You see, when I click on `FetchQuote` it will return the original model, no changes, but will create a side-effect of generating a random number. `Random.generate` creates a `Cmd Msg` and passes the newly generated number into `NewQuote`. When that happens the `update` function listens and pulls in the `Cmd Msg` and you can see that `NewQuote` now returns a new model but no `Cmd Msg`, that’s why it says `Cmd.none`. Now let’s dig into line `7`. What is happening here are a few things. I am using a helper library called `elm-community/list-extra` and exposing the `getAt` function. This helps me to retrieve a quote at the randomly created `index` from the `quotes` list. What is all that other stuff? The `getAt` function returns a `Maybe`, essentially telling us that if the value exists at that `index`, it will return `Just` and that value. Otherwise, it will return `Nothing`. This prevents us from breaking our application in the case that an `index` does not exist in the list. Because of this, we have to extract out the value from the `Maybe` using `withDefault` which comes from the `Maybe` module. The `withDefault` function takes a default value and the actual value if it exists. I created a function called `defaultQuote` to be our default in case the `index` does not exist, but because we are only generating numbers 0 thru the length of our list, chances are you will not see the `defaultQuote` (unless you up the value range of the random number). Just as a test, try out making the `defaultQuote` function on your own. Hint: it looks just like the model.

Now that we have all that in place, I need a button to kick this whole process off. I will update the `view` function to now call the `FetchQuote` message inside of a button. My new `view` function will look like this.

There are a few more steps before this all works. I need to update the Elm program we are running to be `Html.program` and not `Html.beginnerProgram`. Also because we leveled up we need to add `subscriptions`, which in our case will do nothing. In `Html.program`, there is no `model` but instead, `init`. The `init` function returns a tuple of a `Model` and a `Cmd Msg`. I need to pull in a library I mentioned earlier as well. If you look on the left pane of the editor you will see a button “ADD A PACKAGE.” Click on that button and a search box will pop up. If you type in “list extra” the package `elm-community/list-extra` should appear at the top of your search results. Click on the “INSTALL” button that appears to the right of the package name. Lastly, don’t forget your `defaultQuote` or your imports!

_If you are getting errors because you have compiled but don’t have all the correct imports/libraries, that’s okay. I actually want you to see those errors because they are pretty helpful and a core part of what makes Elm great, at lease in my eyes._

If you are feeling confident at this point I would click “COMPILE.” You may get some errors but I find Elm errors to be quite pleasant and I believe in you that you can navigate them with ease. If you are not up for those pesky errors here is a gist of the complete code:

And if you want to see it all in action, here it is in the friendly editor Ellie:

Wow, if you made it this far, thank you! You deserve a gold 🌟!

In this lesson, I covered the Elm architecture and how to stand up a project that has dynamic content. I pulled in community packages and in the end, created a Random Quote Machine that is pretty neat if I do say so myself 😃.

I hope this lesson was helpful, let me know in the comments below 👇🏼!
