---
title: "Let’s Build a Simon Game in ReasonReact Pt. 4 Animations"
description: "The Most Interesting Part of This Series"
publishDate: "2018-10-15"
layout: ../../layouts/BlogPost.astro
---

In this article you will learn how to create the animation for when the Simon Game plays back the sequence the user needs to remember and repeat. When the sequence is being played by the game the box should make a sound and also lighten in color in order to visually show the user which box is active.

### Refactor 👷‍♀️

There is a lot to do in this article but first, there needs to be a little refactoring. Currently, the sequence which gets generated `onMount` is a series of random numbers between 1 and 4 inside of an array. It made sense for it to be this way back in part 1 but this needs to be updated to make it fit with what we are doing now. Instead of the sequence being an array of random numbers, it needs to be updated to be a list of colors.

```javascript
type sequence = list(Types.colors);
```

> `Types.colors` is from a separate file called `Types.re`

Hopefully, your editor will highlight some changes that you need to make to other parts of the code. If so, you will notice your use of `SetSequence` is not correctly used in the `onMount` lifecycle.

```javascript
let list =
    Belt.List.makeBy(
      20,
      \_i => {
        let num = Js.Math.floor(Js.Math.random() \*. 4.0 +. 1.0);
        switch (num) {
        | 1 => Green
        | 2 => Red
        | 3 => Blue
        | 4 => Yellow
        | \_ => Green
        };
      },
    );
```

Instead of an `Array` you are making a `List`. And instead of an array of numbers, you have a list of colors. That’s why you are using pattern matching to update each number to their corresponding color. It’s not likely you will get a number outside of 1 thru 4 but the Reason compiler will yell at you for not being exhaustive enough in your pattern matching. So it’s important to handle all cases, i.e. `_ => Green`, even if they are unlikely to happen.

There is still something wrong here though. The compiler does not understand what `Green` is.

```javascript
Error: Unbound constructor Green
```

My understanding is that the closure, `Belt.List.makeBy`, is not aware of constructors that exist outside of its scope. You can change this by opening and making available the colors type inside the callback function.

```javascript
open Types;
let num = Js.Math.floor(Js.Math.random() \*. 4.0 +. 1.0);
```

The last thing to do here is update initial state. Currently, the initial state for sequence is an empty array. Change this to an empty list.

```javascript
initialState: () => {sequence: []},
```

### Small Tweaks 🏗

Before getting into more of the complex stuff, I think it’s always better to get the small stuff out of the way first. The `state` needs to be updated to account for each `level` the user will play. And when the app mounts the user starts at `level` 1. Update the state type to include a `level` field with a type of `int`.

```javascript
type state = {
  sequence,
  level: int,
};
```

Because you are working in Reason this will set off a series of errors in your editor. Don’t get upset! This is a good thing. The compiler is just making sure you know what you are doing. Next, `initialState` needs to be updated with the initial level: 1.

```javascript
initialState: () => {sequence: [], level: 1},
```

Uh, oh! There is another error inside the reducer:

```javascript
Error: Some record fields are undefined: level
```

In the `SetSequence` action you are setting the sequence but nothing else. In React land, you could get away with this. However, `state` in ReasonReact is an immutable [record](https://reasonml.github.io/docs/en/record#docsNav). That means whenever you change state, you need to create a new copy of it, including all fields. To copy all the fields in ReasonReact, you use the [spread operator](https://reasonml.github.io/docs/en/record#immutable-update), just like you would in JavaScript.

```javascript
| SetSequence(list) => ReasonReact.Update({...state, sequence: list})
```

While I did that I changed `array` to `list` to be consistent.

Next, what needs to be added to state is an `active` field with an `option` type of `colors`. This is because whenever the user clicks a box, or the game plays back a sequence, there needs to be some visual indicator for the box that is making a sound. I am calling this `active`. The box will be inactive most of the time, but when a box makes a sound it will be `active` and shortly after it will go back to being inactive. That is why the color will be wrapped in an `option` because in most cases it will be a `None`. This is probably a good time to learn about `option` types. If so, check this out 👉 [https://reasonml.github.io/docs/en/null-undefined-option#docsNav](https://reasonml.github.io/docs/en/null-undefined-option#docsNav).

```javascript
type state = {
  sequence,
  level: int,
  active: option(Types.colors),
};
```

This again kicked off some changes in your app. Now, `initialState` needs to be updated. Head over to `initialState` and update it to have an `active` of `None`.

```javascript
initialState: () => {sequence: [], level: 1, active: None},
```

Having the compiler yell at you may seem annoying, but trust me, you will learn to appreciate this helper.

Lastly, what is needed is to create an action called `PlaySequence`, which as you might of guessed, plays the sequence. It takes no arguments.

```javascript
type action =
  | SetSequence(sequence)
  | PlaySequence;
```

In your `reducer` you should now see this nice warning.

```javascript
Warning 8: this pattern-matching is not exhaustive.
Here is an example of a value that is not matched:
PlaySequence
```

Don’t worry about having any logic for that action. Just pass in `ReasonReact.NoUpdate` and keep moving.

```javascript
reducer: (action, state) =>
    switch (action) {
    | SetSequence(list) => ReasonReact.Update({...state, sequence: list})
    | PlaySequence => ReasonReact.NoUpdate
    },
```

Now that all those things are in place let’s shift over to JSX.

### HTML aka JSX 📄

In order for the user to know what level they are on, let’s render the level that is in state into the JSX.

What’s nice about ReasonReact is you can do a lot of the same things in it as you would in React. For example, you can destructure. Here you will destructure the state record and pluck off the level field.

```javascript
render: self => {
    let {level} = self.state;
    /* More stuff here */
  },
```

With the `level` field in hand, let’s render it to the user.

```javascript
<div className=Styles.controls>
  <div> {{j|Level: $level|j} |> ReasonReact.string} </div>
</div>
```

You notice I am using `{j||j}`. This is [interpolation](https://reasonml.github.io/docs/en/string-and-char#quoted-string) syntax. Then I can just add the `$` in front of `level` and it transforms the `int` into a `string`.

I updated some styles along the way. I added a new set of styles called `controls`.

```javascript
let controls = style([marginTop(`px(10))]);
```

And I changed the flex direction of the container so things flow top to bottom.

```javascript
let container =
    style([
      display(`flex),
      justifyContent(`center),
      alignItems(`center),
      minHeight(`vh(100.0)),
      flexDirection(`column), /* This is new */
    ]);
```

The game in all its glory.

You have now come this far. Good. There is still a bunch more to go 😄.

### Ready Player One 🎮

The kickoff of the game begins when the player hits the `start` button. Hitting the button sends the action `PlaySequence` to the reducer, where it will handle the rest. Add some markup in the `render` function that does just this.

```javascript
<div className=Styles.controls>
  <div> {{j|Level: $level|j} |> ReasonReact.string} </div>
  <div>
    <button onClick={_e => self.send(PlaySequence)}>
      {"Start" |> ReasonReact.string}
    </button>
  </div>
</div>
```

Because the event object is not being used I put an underscore in front of it. Also, I wrapped the button in a `div`. There will be another button, reset, at some point that sits to the right of `Start`.

Now it’s time to get into how the game will playback the sequence which will take place in the reducer.

When the reducer receives the action `PlaySequence` it needs to play back the sequence up to the point of the level. Then the user will repeat the sequence and move up a level. Right now, though, you will only focus on the play back of the sequence, not any user input.

Because you only playback the sequence up to the current level, you need to slice the sequence up to that level, then iterate on each color and play its corresponding jingle. To slice the sequence, use the `Belt.List.take` function for this.

```javascript
| PlaySequence =>
  let l =
    Belt.List.take(state.sequence, state.level)
    ->Belt.Option.getWithDefault([]);
  ReasonReact.NoUpdate;
```

The `Belt.List.take` function takes a list and how much to take to. This returns an `option` type. I am using a helper, [fast pipe](https://reasonml.github.io/docs/en/fast-pipe#docsNav), to pipe in the result of the `take` function as the _first_ argument to `getWithDefault`. If I get a `None` back, I will return an empty list.

ReasonReact has the concept of handling actions which only produce side-effects, with no update to state. You will use that here. The effect you are creating is iterating through each item in the list and outputting the color to the console.

```javascript
let l =
    Belt.List.take(state.sequence, state.level)
    ->Belt.Option.getWithDefault([]);
    ReasonReact.SideEffects(
      (
        _self =>
          Belt.List.forEachWithIndex(
            l,
            (index, color) => {
              let _id =
                Js.Global.setTimeout(
                  () => Js.log({j|$color|j}),
                  index \* 1000,
                );
              ();
            },
          )
      ),
    );
```

Click the start button and see what happens. You will see some random number output to the console. The number does represent a color type but BuckleScript does this in a more optimized way under the hood. That’s why you see a number and not a string.

You didn’t come here to render some number to the screen! You want to hear a sound play, am I right? Let’s create an action which handles that. Call it `PlaySound`.

```javascript
type action =
  | SetSequence(sequence)
  | PlaySequence
  | PlaySound(Types.colors);
```

Now update the reducer.

```javascript
| PlaySound(color) => ReasonReact.NoUpdate
```

And apply this action inside of the `ReasonReact.SideEffects` handler.

```javascript
(index, color) => {
  let _id =
    Js.Global.setTimeout(
      () => self.send(PlaySound(color)),
      index \* 1000,
    );
  ();
},
```

Still not a darn thing is going to happen. Let’s fix that in `PlaySound`.

This time you will use `ReasonReact.UpdateWithSideEffects`. This is because you want to set the `active` color on state, make a sound, then remove the `active` color.

```javascript
| PlaySound(color) =>
    ReasonReact.UpdateWithSideEffects(
      {...state, active: Some(color)},
      (
        _self => {
          Js.log2("color: ", color);
        }
      ),
    )
```

There is a problem, however. How do we dynamically retrieve the sound instance for each color? Unfortunately, you can’t do `Sounds[color]##play()` as you can in JavaScript. Oh, the joys of dynamic languages. Instead, let’s create a helper which will allow you to dynamically get the sound you need.

```javascript
/* Sounds.re */
open Types;

/* Sound instances here */

let map = [(Green, green), (Red, red), (Blue, blue), (Yellow, yellow)];
```

Here you have an [associative list](https://reasonml.chat/t/how-to-create-an-associative-list-in-reason/1129). It acts as a map, or dictionary, and allows you to dynamically retrieve the sound based on the color type using `Belt.List.getAssoc`. Let’s try it out.

```javascript
| PlaySound(color) =>
    ReasonReact.UpdateWithSideEffects(
      {...state, active: Some(color)},
      (
        _self => {
          let sound =
            Belt.List.getAssoc(Sounds.map, color, (==))
            ->Belt.Option.getWithDefault(Sounds.green);
          sound##play();
        }
      ),
    )
```

The `getAssoc` function returns an option so I make sure to pass it through `getWithDefault`. Now play it!

Change the `level` to 5 in `initialState` so you can hear more than just 1 jingle.

Oh snap, it works! Well, at least the sound part of it does.

### CSS Hackery 👩‍🎨

At this point, you are making a sound but with no visual indicator, you don’t know which box is making that sound. You do know the `active` color though, which will help you to adjust the CSS styles of the box that is `active`.

Update the `box` styles to accept both a `bgColor` and an `active` `color` as [labeled arguments](https://reasonml.github.io/docs/en/function#labeled-arguments).

```javascript
let box = (~bgColor: Types.colors, ~active: option(Types.colors)) =>
```

> Also change `switch (color)` to `switch(bgColor)`

Unlike in JavaScript, in Reason, you have the ability to label your arguments. This means you don’t have to know the order of the arguments in order to call the function accordingly. This just jacked up our `box` style in the `render` function. Let’s fix that.

```javascript
<div
  className={Styles.box(~bgColor=Green, ~active)}
  onClick={_e => Sounds.green##play()}
/>
```

How am I using `~active` that way? Well, I destructured it above.

```javascript
let { level, active } = self.state;
```

That allows me to write `~active` which is shorthand for `~active=active`.

As I stated before, there needs to be some visual indicator for the box making the sound. For this, I will adjust the `opacity` of the box to be lighter than the others. When the `active` color is the same as the `bgColor`, the `box` will have `opacity` of `0.5`, otherwise, it will be `1.0`.

```javascript
let opacity =
      switch (bgColor, active) {
      | (Green, Some(Green)) => opacity(0.5)
      | (Red, Some(Red)) => opacity(0.5)
      | (Blue, Some(Blue)) => opacity(0.5)
      | (Yellow, Some(Yellow)) => opacity(0.5)
      | (_, None) => opacity(1.0)
      | (_, Some(_)) => opacity(1.0)
      };

/* More stuff here */

style([bgColor, opacity, ...baseStyle]);
```

Play time again!

You notice it worked but it is missing something. The color just sticks, it doesn’t reset like it should. Create an action! Call it `ResetColor` and after `300ms`, `active` color is reset to `None`.

```javascript
type action =
  | SetSequence(sequence)
  | PlaySequence
  | PlaySound(Types.colors)
  | ResetColor;
```

Now update the reducer.

```javascript
| ResetColor => ReasonReact.Update({...state, active: None})
```

Lastly, call the action inside of `PlaySound`.

```javascript
(
 self => {
   let sound =
   Belt.List.getAssoc(Sounds.map, color, (==))
   ->Belt.Option.getWithDefault(Sounds.green);
   sound##play();
   let _id = Js.Global.setTimeout(() => self.send(ResetColor), 300);
   ();
 }
),
```

It works! Hopefully 😅.

### Side Note 🗒

I realize this may not be the best way to handle these actions. I am not clearing the timeout which can cause a memory leak. I will investigate this further and see if in the next section you can do a refactor to improve this.

### Summary 📝

If you have stuck it out this far then you deserve a slow clap 👏. In this article, you learned how to create dynamic actions in ReasonReact. That was pretty fun if I do say so myself. In the next lesson, you will handle user input. That’s all I have for now.

- [React Reason Simon Game Part 4](https://github.com/arecvlohe/reason-react-simon-game/tree/part_4)
