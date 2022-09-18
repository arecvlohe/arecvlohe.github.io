---
title: "Create a FAC Component in ReasonReact"
description: "Funk as Child"
publishDate: "2018-08-23"
layout: ../../layouts/BlogPost.astro
---

In the React ecosystem, RenderProp components are all the rage. Now with the latest release of React, the new Context API makes everyone also aware of the Function As Child pattern that inspired it. This pattern is used quite a bit in the ReasonReact ecosystem, for example [reason-apollo](https://github.com/apollographql/reason-apollo), so I will demonstrate with my words and code snippets how to create a Function as Child component in ReasonReact. Let’s get started.

### Getting Started 🚀

You will be using [Jared Palmer](https://github.com/jaredpalmer)’s [Razzle](https://github.com/jaredpalmer/razzle) framework to get setup. I know, it’s not the “official” setup when working with ReasonReact but I found it to be the easiest to setup. Plus, if you are interested in making this it into a full-blown application you are off to an excellent start.

Read through the example below and come back to me when you are done. ✌️

- [Razzle](https://github.com/jaredpalmer/razzle/tree/master/examples/with-reason-react)

You are going to create a FAC counter component. I know, “yet another counter example” but let’s be honest, where would the development community be without “yet another” click-bait headlines? First, you will create the FAC component by creating a file called `CounterFAC.re`

### Create the FAC 👨‍🎨

First, create the component and it’s base functionality. All you want is some state, the current value of the count, and two functions that either add one or subtract one from the count.

```javascript
/\* CounterFAC.re \*/

type func = (ReactEventRe.Mouse.t) => unit;

type childProps = {
  count: int,
  increment: func,
  decrement: func
};

type action =
  | Increment
  | Decrement;

type state = {count: int};

let component = ReasonReact.reducerComponent("CounterFAC");

let make = (children: childProps => ReasonReact.reactElement) => {
  ...component,
  initialState: () => {count: 0},
  reducer: (action: action, state: state) =>
    switch action {
    | Increment => ReasonReact.Update({count: state.count + 1})
    | Decrement => ReasonReact.Update({count: state.count - 1})
    },
  render: self =>
    <div>
      (
        children({
          count: self.state.count,
          increment: (\_e) => self.send(Increment),
          decrement: (\_e) => self.send(Decrement)
        })
      )
    </div>
};
```

> For some odd reason, `type childProps` needs to be above `type state` and `type action`.

### Notes on Creating a FAC 🗒

Let’s dig in to what is happening here.

```javascript
type func = (ReactEventRe.Mouse.t) => unit;
```

A function that takes a mouse event and returns nothing, also known as unit.

```javascript
type childProps = {
  count: int,
  increment: func,
  decrement: func,
};
```

The definition of the `childProps` you are passing to the child function.

```javascript
type action = Increment | Decrement;
```

The actions you are listening for.

```javascript
type state = { count: int };
```

The state type which is a record with count as an integer type.

```javascript
let component = ReasonReact.reducerComponent("CounterFAC");
```

The name and type of component. Because you are handling state you need to use a `reducerComponent`.

```javascript
let make = (children: childProps => ReasonReact.reactElement) => {
  ...component,
}
```

The definition of your component. Because children is a function it will take `childProps` as an argument and then render a `ReasonReact.reactElement` from it.

```javascript
initialState: () => {count: 0},
```

Setting the initial state to zero.

```javascript
reducer: (action: action, state: state) =>
    switch action {
    | Increment => ReasonReact.Update({count: state.count + 1})
    | Decrement => ReasonReact.Update({count: state.count - 1})
    },
```

Handling the actions in the component. Whenever the component gets back `Increment` or `Decrement` it knows what to do.

```javascript
render: self =>
    <div>
      (
        children({
          count: self.state.count,
          increment: (\_e) => self.send(Increment),
          decrement: (\_e) => self.send(Decrement)
        })
      )
    </div>
```

Passing the `count`, as well as two functions, `increment` and `decrement`, to the child. Variables with an underscore, `_e`, means they are not being used even if they are being passed. Self refers to `this` in JS terms. The `send` refers to the `setState` function but it’s more declarative because you say what action you want to fire and let the `reducer` handle the rest.

### Render FAC 🌧 🦌

Nice, huh?! Now you are ready to render this bad boy/girl. Go to `Home.re` and remove everything and put in your new `CounterFAC` and go to town with it.

```javascript
/\* Home.re \*/

let text = ReasonReact.stringToElement;

let component = ReasonReact.statelessComponent("Home");

let make = \_children => {
  ...component,
  render: \_self =>
    <CounterFAC>
      ...(
        ({ count, increment, decrement }) => {
          <div>
            <div>(count |> string\_of\_int |> text)</div>
            <button onClick={increment}>("Increment" |> text)</button>
            <button onClick={decrement}>("Decrement" |> text)</button>
          </div>
        }
      )
    </CounterFAC>
```

### Notes Pt. 2 📝

Some notes here.

```javascript
count |> string\_of\_int |> text
```

The `string_of_int` function comes from good ole’ Ocaml which converts an `int` into a `string`.

```javascript
({ count, increment, decrement }) => {
```

The props you passed to the child function.

```javascript
...(
```

I think this is because `ReasonReact` expects you to pass an array of elements so you spread them out here? If you know more about this, please clarify in the comments below.

```javascript
<button onClick={increment}>("Increment" |> text)</button>
```

`Increment`, or not, the count. Pass the string to `text` in order for it to render properly in `ReasonReact`.

And that’s it!

### Summary 👏

In this article you learned how to create a FAC component in ReasonML. Now you can take your new found knowledge over to the water cooler where it belongs 😄.
