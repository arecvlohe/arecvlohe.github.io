---
title: "Less Redux Boilerplate with Union Types"
description: "Making the Impossible…Possible? An Attempt at Least"
publishDate: '2017-09-02'
layout: ../../layouts/BlogPost.astro
---

If you have ever setup Redux in a new project you know the crazy amount of boilerplate that’s needed to “get started.” You need a store, reducers, selectors, actions, health insurance, and the exact date of the last time you travelled abroad. Yes, I understand the argument for “separation of concerns” and how the splitting up of files is supposed to help me reason about my application better. I think, though, this has been taken to an extreme. What about rethinking this whole split file structure and instead think of [modules](https://www.youtube.com/watch?v=XpDsk374LDE&t=1385s) as a separation of data, not responsibility.

That was a bit of context and philosophy behind what spurred this blog post. Now let’s get into coding something. We are going to create a simple counter (sorry I am not original!) with the help of the [union-type](https://github.com/paldepind/union-type) library with influence from [The Elm Architecture](https://guide.elm-lang.org/architecture/).

### Getting Started 🚀

To get started let’s pull in the necessary libraries and create a simple react application using `create-react-app`.

```bash
$ create-react-app redux-union && cd redux-union && yarn add union-type redux react-redux ramda && yarn start
```

You might want to watch [this](https://www.youtube.com/watch?v=WyMpZTba5Tc&t=213s) to kill the time. It’s going to be a while 😁.

### Get Going Already! 🏃🏻

After everything is installed, create a single `index.js` file within a `store` folder and pull in the necesary dependencies.

```javascript
import { combineReducers, createStore } from "redux";
import Type from "union-type";
import memoize from "ramda/src/memoize";
import path from "ramda/src/path";
```

Okay, so what is a union type? A union type is a common data structure in functional programming languages. Essentially, it allows you to extend data types all under a single parent. For example, in Elm you will commonly see the type`Msg`. Then underneath `Msg` there will be `ButtonClick` in this format: `type Msg = ButtonClick | NoOp`. This allows you to then pattern match in your `update` function on a `Msg` whenever one is sent from a handler in the DOM.

```elm
case msg of
  ButtonClick ->
      model ! \[\]
```

It’s a really nice pattern that simplifies a common process: handling user interaction. It also allows you to be more declarative with your program by creating data types on the fly that speak more to the domain specific terminology of your application. Let’s now create the messages for this program.

### Messages 💬

```javascript
const Msg = Type({ INCREMENT: \[\], DECREMENT: \[\] });
```

I am keeping with some Elm conventions here. Instead of calling these `Actions` for example, I simply call them `Msg`, short for message. I think this makes more sense for not just a beginner, but anyone with any background not in JavaScript or Elm. The `[]` is essentially the types that would be passed to these type unions if we passed any types. For example, a number. In this case we are not passing anything so it’s left empty. Now that I have my types let’s create the handlers for these different messages.

```javascript
const nextState = Msg.caseOn({
  INCREMENT: state => ({ count: state.count + 1 }),
  DECREMENT: state => ({ count: state.count - 1 }),
  \_: state => state
});
```

There is one thing that is a bit obscure about this function. In the background you are passing `action` and `state` to `nextState`. So to visually understand just imagine `nextState` as `nextState(action, state)`.

### State 📱

In the typical Elm way, let’s describe the model, in this case the `state`.

```javascript
const initialState = {
  count: 0
};
```

### Update ⏰

Next, let’s create the update function, in this case the reducer which will be called `state`.

```javascript
function state(state = initialState, { type = Msg.DEFAULT, payload = null }) {
  if (typeof type === "string") return state;
  return nextState(type, state);
}
```

I had a couple issues with getting the application to initialize properly with Redux but `if (typeof type === “string”) return state` seemed to do the trick. Usually the first action to a reducer is `@@redux/INIT` to initialize it. It seems other actions were being passed as well that were also strings, so to get around this I just did a catch all for those actions coming from Redux.

### Store 🏪

Next, it’s time to initialize the store.

```javascript
// STORE

const store = createStore(
  combineReducers({
    state
  }),
  window.\_\_REDUX\_DEVTOOLS\_EXTENSION\_\_ && window.\_\_REDUX\_DEVTOOLS\_EXTENSION\_\_()
);
```

If you have the [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension), then great! But don’t worry about it. We have a `store`, with a key of `state`, that also has a `state` key on it. Here I just want to work with a single reducer, not multiple. KISS! 💋

### Actions 🤹‍

With the `store` initialized I can create actions to dispatch to the store.

```javascript
export const add = () => store.dispatch({ type: Msg.INCREMENT });
export const subtract = () => store.dispatch({ type: Msg.DECREMENT });
```

> Friendly Tip: You will find that when you fire an action, in the redux-devtools you will see `[object Object]` instead of the actual action. You might want to configure your own logger to correctly log out the actions.

One reason I like this is because I don’t have to pass `mapDispatchToProps` to my `connect` function. I am trying to create less boilerplate, not more!

### Selectors 👉

Next to last, create a selector for your state. Here I am using some helpers from [Ramda](http://ramdajs.com/docs/) to create a memoized selector.

```javascript
export const count = memoize(path(\["state", "count"\]));
```

Last but not least, let’s export the store in order to pass it down as a `prop` to our component.

```javascript
export default store;
```

That wasn’t too bad was it? At this point you can now wrap your application with `Provider` and your `App` component with `connect` passing in `mapStateToProps`.

### App Component 👩‍💻

Inside of `App.js` this is what I have.

```javascript
import React from "react";
import { add, subtract, count } from "./store";
import { connect } from "react-redux";

const mapStateToProps = state => ({ count: count(state) });

export default connect(mapStateToProps)(({ count }) => {
  return (
    <div className="App">
      <button type="button" onClick={add}>
        ADD
      </button>
      <button type="button" onClick={subtract}>
        SUBTRACT
      </button>
      {count}
    </div>
  );
});
```

Remember to update your `index.js` file with the `Provider`.

```javascript
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import store from "./store";

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
registerServiceWorker();
```

### Summary ✅

In this lesson you learned about union types and how to use them to \*reduce\* your Redux boilerplate. This also implies adhering to some conventions around file structure. This is not perfect and I am sure there are even more ways to make your Redux footprint smaller. If there is, please share! I am interested to hear how this model can be improved. Thank you and until next time, keep hacking!

> Did you know you can add additional type security in your application with union types? It’s not something I talked very much about here but something that I think is worth your time looking into.

The repo for this article can be found 👇

- [Redux Union](https://github.com/arecvlohe/redux-union)

For an async example, ✔️ this one out ↓

- [React Redux Union](https://github.com/arecvlohe/react-redux-union)

This article was influenced by [Josh Burgess](https://medium.com/u/1e1c827af4c4) demo on a similar topic:

- [Inferno/Most Demo](https://github.com/joshburgess/inferno-most-fp-demo)
