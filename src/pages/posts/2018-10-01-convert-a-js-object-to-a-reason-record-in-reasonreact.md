---
title: "Convert a JS Object to a Reason Record in ReasonReact"
description: "Using BuckleScript…duh"
publishDate: "2018-10-01"
layout: ../../layouts/BlogPost.astro
---

**_UPDATE 12/7/2019: With the release of reason-react 0.7.0, you no longer need to worry about transforming objects to be used in a reason-react component. Just add the types and the props you are passing to the component and use them. In this article, it’s as easy as:_**

```javascript
type data = {
  name: string,
  age: int,
  profession: string,
};

[@react.component]
let make = (~data) => {
   // use `data` as record (i.e. data.name, data.age, etc.)
}
```

**_Nothing more to do!_**

I was playing around with ReasonReact recently and I was trying to figure out how to handle data coming from JS into Reason. I had heard of using `[@bs.deriving abstract]` which takes a JS object and transforms it into a Reason object. In a way this worked. However, the implementation did not seem clean because after conversion I would need to use a series of getters in order to retrieve the values from the object. Let me give you an example to clear up any confusion.

In my JavaScript file I have my basic React setup.

```javascript
import React from "react";
import ReactDOM from "react-dom";

import App from "../lib/es6_global/src/App";

const data = {
  name: "Adam Recvlohe",
  age: 31,
  profession: "developer",
};

ReactDOM.render(<App data={data} />, document.querySelector("#root"));
```

The `App` in this instance is a ReasonReact component that is being wrapped for JS. However, part of the ReasonReact component’s implementation is to accept a JavaScript object which describes moi.

One way to convert this inside of Reason is to use`[@bs.deriving abstract]` to convert the JS object into a Reason object. Here is how you would do that:

```javascript
/* App.re */

[@bs.deriving abstract]
type data = {
  name: string,
  age: int,
  profession: string,
};

/* Imagine component and make functions here */

type jsProps = {data};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~data=jsProps##data, [||])
  );
```

However, this can lead to some weirdness in your component:

```javascript
/* App.re */

let component = ReasonReact.statelessComponent("App");

let make = (~data, _children) => {
  ...component,
  render: _self => {
    let name = data->nameGet;
    let age = data->ageGet;
    let profession = data->professionGet;
    <div>
      {
        {j|Hello 👋. My name is $name. I am $age years old. I am a $profession.|j}
        |> ReasonReact.string
      }
    </div>;
  },
};
```

The `[@bs.derving abstract]` directive creates an object with the respective accessors to the values with the syntactic sugar of using the new fast pipe (->) operator.

This seemed okay to me but I wanted better. So I asked around the [reasonml.chat](https://reasonml.chat/t/convert-js-object-to-reason-record-in-reasonreact/1106/2) forum to see what other magic I had at my disposal. User [IwanKaramazow](https://reasonml.chat/u/IwanKaramazow) directed me to another helpful directive known as `[@bs.deriving jsConverter]`. This will convert a JS object to a Reason record, which has a bit more syntactic sugar because it will allow me to use destructuring. It looks a little like this:

```javascript
/* App.re */

[@bs.deriving jsConverter]
type data = {
  name: string,
  age: int,
  profession: string,
};

/* Imagine component and make functions here */

type jsProps = {data};

let default =
  ReasonReact.wrapReasonForJs(~component, jsProps =>
    make(~data=dataFromJs(jsProps##data), [||])
  );
```

You will notice I need to wrap the `data` object in a function that is created from the directive: `dataFromJs(jsProps##data)`. This function is dependent on what I call my type. If my type was not `data` but instead `profile`, the function name would then be called `profileFromJs`. After converting the data into a record I can now more succinctly handle the data inside of my component:

```javascript
let make = (~data, _children) => {
  ...component,
  render: _self => {
    let {name, age, profession} = data;
    <div>
      {
        {j|Hello 👋. My name is $name. I am $age years old. I am a $profession.|j}
        |> ReasonReact.string
      }
    </div>;
  },
};
```

As you can see I am using destructuring instead of an assignment with an accessor to work with the values I need.

It’s not always apparent what things are and are not possible because of the varying API’s at your disposal when working with Reason. You have Reason, BuckleScript, and lastly Ocaml API’s. Thankfully there is a helpful Reason community who has your back. So check out the [forum](https://reasonml.chat/) or leave me a note here if you have any questions yourself. Otherwise, keep on hacking y'all!
