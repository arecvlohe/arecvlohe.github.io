---
title: "Let’s Build a Simon Game in ReasonReact Pt. 5 User Input"
description: "The Business of Business Logic"
publishDate: "2018-10-16"
layout: ../../layouts/BlogPost.astro
---

In this article, you will learn to handle user input and either inform the user of valid or invalid input. Let’s begin.

The way the Simon Game works is that after clicking `Start` the sequence will play up to the current level. If the level is 1, it will play 1 jingle. If you repeat that sequence then you graduate to level 2. At that point, you will hear 2 jingles and if you repeat that you graduate to level 3. So on and so forth.

Let’s step through how the game will function using good ole’ bullet points.

- User clicks start button and the initial sequence plays
- The user repeats this by clicking on the corresponding box
- If the user clicks on the wrong box, they will hear an error and the sequence will start over
- If the user clicks on the right box, the will hear the sound of the box
- If the user clicks on all the right boxes, the user will graduate to the next level

Let’s make this into code!

### Foundations 🚧

I like to start with the small stuff first and gradually move up to the things that are more complex. To handle user actions you will need, you guess it, an action. Create an action called `Input` which takes a `color` type.

```javascript
type action =
  | SetSequence(sequence)
  | PlaySequence
  | PlaySound(Types.colors)
  | ResetColor
  | Input(Types.colors); /\* This is new \*/
```

Next update the `reducer` to handle that action as you have done before.

```javascript
| Input(color) => ReasonReact.NoUpdate
```

There needs to be a way to track user input in order to make sure that after each click of a box, there is a way to see if the box clicked matches up with the sequence at that point in time. Add a field to state called input and have its type be a `list` of `colors`.

```javascript
type state = {
  sequence,
  level: int,
  active: option(Types.colors),
  input: list(Types.colors), /\* This is new \*/
};
```

As usual, update initial state to reflect these changes.

```javascript
initialState: () => {sequence: \[\], level: 5, active: None, input: \[\]},
```

After the user clicks a box it’s now important to check and make sure the input is correct. You can handle this using another action. Call it `CheckInput`. This action will fire right after `Input(color)` is handled.

```javascript
type action =
  | SetSequence(sequence)
  | PlaySequence
  | PlaySound(Types.colors)
  | ResetColor
  | Input(Types.colors)
  | CheckInput; /\* This is new \*/
```

Update the reducer now.

```javascript
| CheckInput => ReasonReact.NoUpdate
```

Now let’s get down to business.

### Sound Logic 🧠

See what I did there. Sound. Logic. Dad joke of the year! But it actually makes sense here. When the user clicks a box, you add to state that `color`, then you can compare the first element in the `input` _and_ then get the size of the input to then pluck off the `color` in the sequence at the index equal to the size. If that went over your head let’s write some code to clarify things.

First, there is going to be an `UpdateWithSideEffects` where the `input` is updated.

```javascript
ReasonReact.UpdateWithSideEffects(
   {...state, input: \[color, ...state.input\]},
  (self => self.send(CheckInput)),
)
```

I am adding a new `color` to `input` by adding to the head and spreading out the previous version of the list to the tail. Now that the input is updated, let’s check to see if the user’s input is accurate. That’s why you call the action `CheckInput`, which will house the logic for how user actions are handled.

Inside of `CheckInput`, pluck off the head element to begin. This will give us the latest user input that needs to be tested against the sequence.

```javascript
let { level, input, sequence } = self.state;
let currentUserColor = Belt.List.headExn(input);
```

I am using `Belt.List.headExn`. This is what makes ReasonML an impure language in the functional sense. Instead of returning an `option` type, this function will either return back the value at the head of the list or will throw an exception if the `list` is empty. I think this is okay for what we are trying to do because I wouldn’t expect `input` to ever be empty. You can write the code however you like but this works for me.

Next, get the length of the list.

```javascript
let inputLength = Belt.List.length(input);
```

And finally, get the current color for where the user is in the sequence.

```javascript
let currentSequenceColor = Belt.List.getExn(sequence, inputLength - 1);
```

Again, I am using `Belt.List.getExn`, impure but I am okay with it here. The whole enchilada.

```javascript
let { level, input, sequence } = self.state;
let currentUserColor = Belt.List.headExn(input);
let inputLength = Belt.List.length(input);
let currentSequenceColor = Belt.List.getExn(sequence, inputLength - 1);
```

I am going to enjoy the next part because I will get to use [pattern matching](https://reasonml.github.io/docs/en/pattern-matching#docsNav) to solve this problem!

### Pattern Matching FTW 🙌

Pattern matching is a great way to simplify what can turn into very inefficient or complex steps. There are three scenarios at the current moment to check on: If the user clicked an incorrect box, if the user clicked a correct box, and if a user clicked a correct box and graduates to the next level. I imagine this can get complex in an `if/else` statement but pattern matching makes this quite easy. Let me show you.

```javascript
switch(
currentUserColor === currentSequenceColor,
inputLength === level) {
    /\* More to come here \*/
}
```

That is all you will need. Pretty succinct, huh? Let’s handle the first scenario for when a user hits the wrong box. The user will hear the error sound, then their input will be cleared, and the sequence will play again.

```javascript
| (false, \_) =>
      ReasonReact.UpdateWithSideEffects(
        {...state, input: \[\]},
        (
          self => {
            Sounds.error##play();
            self.send(PlaySequence);
          }
        ),
      )
```

You might have noticed that the second pattern I am trying to match has an underscore instead of a boolean. This is because I don’t care about the second pattern. I only care whether the user input is false, and if it is, I play the error sound and have the user start over again.

Next, you need to handle when the user’s input is true but has not reached the last sequence in the level. At that point, you only are going to play the sound.

```javascript
| (true, false) =>
      ReasonReact.SideEffects(
        (self => self.send(PlaySound(currentUserColor))),
      )
```

Finally, handle when the user input is correct and has reached the last sequence. You will clear the user’s input, increment the level, play the sound, and then play the next sequence.

```javascript
| (true, true) =>
      ReasonReact.UpdateWithSideEffects(
        {...state, input: \[\], level: state.level + 1},
        (
          self => {
            self.send(PlaySound(currentUserColor));
            self.send(PlaySequence);
          }
        ),
      )
```

You may have noticed that `PlaySequence` does not have an initial delay. For example when the index is `0`, `0` multiplied by `1000` is `0`. Therefore, `PlaySound` and `PlaySequence` will pretty much be simultaneous. Let’s update `PlaySequence` slightly so that the first element has a slight delay.

```javascript
(index + 1) \* 1000,
```

This will not do a darn thing without you adding the `Input(color)` action to the `onClick` handler in the boxes.

```javascript
<div
  className={Styles.box(~bgColor=Green, ~active)}
  onClick={\_e => self.send(Input(Green))}
/>
```

Oh yeah, let's see this thing go!

### Summary 📝

In this article, if you didn’t just scroll to the bottom, you learned how to handle business logic pretty seamlessly using pattern matching. That was fun. In the next lesson, you will tidy up the application more by adding a reset button, a strictness option, and some more niceties.
