---
title: "How to Map an Array (A Poem)"
description: "How to map you say,There are more than just three ways to map an array, But from just one language is not okay,Instead we will look at…"
publishDate: "2017-04-11"
layout: ../../layouts/BlogPost.astro
---

How to map you say,
There are more than just three ways to map an array, 
But from just one language is not okay,
Instead we will look at how to do it the JavaScript, Elixir, and Elm way.

As I learn more about FP,
I am struck by all the ways one can do things differently,
It’s so interesting to see how other languages are conceptually,
And how they formed their language to handle certain necessities.

So let’s look at how to map an array,
Doesn’t matter what it should say,
It’s more about looking at how languages convey,
Ways of mapping values into new lists, also called arrays.

Let’s first look at the language I am most comfortable with,
JavaScript, the language with the most Github commits,
To map an array we will use Array.Prototype.map,
And from there pass a function to tell it how to act.

The function takes three parameters,
The value, the index, and the array itself,
From there we can do anything we want to,
We can even make it yell!

```javascript
// Make values yell based on index
const loves = \["She loves me", "She loves me not", "She loves me"\]
const sheLovesMe = loves.map((value, index, self) => {
  if (index % 2 === 0) {
    return value.toUpperCase() + '!'
  }
  return value + ' :('
})
console.log(sheLovesMe) //=
  \["SHE LOVES ME!", "She loves me not :(", "SHE LOVES ME!"\]
```

Oh how interesting it is to see,
“She loves me” is based conditionally,
As simple as it can be,
Let’s now replicate that, we can do it, you and me.

Elixir also allows you to map,
But you will need a module to tap,
It is known as Enum if you’re not aware,
It takes a list and a function, just a pair.

Now let’s do what we did before,
You will see that it’s a different order,
The outcome will be the same,
But it still may twist up your brain.

```elixir
loves = \["She loves me", "She loves me not", "She loves me"\]
sheLovesMe =
  loves
    |> Enum.with\_index
    |> Enum.flat\_map(fn({value, index}) ->
         if rem(index, 2) == 0 do
           \[String.upcase(value) <> "!"\]
         else
           \[value <> " :("\]
         end
       end
     )
sheLovesMe //=
    \["SHE LOVES ME!", "She loves me not :(", "SHE LOVES ME!"\]
```

Oh my what does that say?
I have to pass the `with_index` into the array?
That is quite a different, what is `flat_map` anyway,
I could be sitting here all day!

But enough with Elixir, now on to Elm,
Another FP language that is at the front-end helm,
How do they map an array?
First you should know they are called lists, how cray cray!?

```elm
loves =
    \[ "She loves me", "She loves me not", "She loves me" \]

sheLovesMe loves =
    let
        func index value =
            if index % 2 == 0 then
                String.toUpper(value ++ "!")
            else
                value ++ " :("
    in
        List.indexedMap func loves

sheLovesMe loves //=
    \["SHE LOVES ME!","She loves me not!", "SHE LOVES ME!"\]
```

What is that I see, a `let`,
I wonder what that could be,
Oh how lost I am in this sea of FP,
Show me something familiar, I plea!

Sorry, I cannot do that for thee,
For learning hurts sometimes with all that there can be,
All kinds of things that give your brain a thinking spree,
But it will get better, you will see.

That is all for this time around,
I hope this was enlightening, something you found,
Interesting in what other languages do,
I know I did, let me know too!
