---
title: "Getting Started with ReasonReact"
description: "Using bs-platform and webpack to build a development environment"
publishDate: '2018-09-28'
layout: ../../layouts/BlogPost.astro
---

**_UPDATE 12/7/2019: This article, and accompanying GitHub repository, has been update to reflect bs-platform@7.0.1_**

**_UPDATE: This article, and accompanying GitHub respository, has been updated to reflect bs-platform@6.0.1, reason-react@0.7.0, and react@16.8.5_**

I scoured the web for a decent development environment for a [reason react](https://reasonml.github.io/reason-react/) web application with some success. I first started with [reason-scripts](https://github.com/reasonml-old/reason-scripts), since I come from react land and was accustom to “convention over configuration” with [create-react-app](https://github.com/facebook/create-react-app). Initially it was a success but eventually, I ran into compiling issues. At times it would compile with errors and other times it wouldn’t. This back and forth of saving and waiting for it to compile, or error out, was hampering the speed at which I could develop. I knew I had to find something else.

I then found [razzle](https://github.com/jaredpalmer/razzle) with an accompanying [with-reason-react](https://github.com/jaredpalmer/razzle/tree/master/examples/with-reason-react) setup. I really love the work [Jared Palmer](https://medium.com/u/fb7a3c353cc1) does so it was awesome to find this setup. But this too came with its own trade-offs. For example, it uses an older version of [bs-platform](https://github.com/bucklescript/bucklescript#readme) so it was out of date with some libraries. Even though I felt constrained using razzle it did give me ideas for how to build my own dev environment with bs-platform and [webpack](https://webpack.js.org/).

ReasonReact is still in its early days and with that comes a lot of instability and changes. If you are beginning to use ReasonReact yourself it’s probably better to create your own setup that you can control in order to move quickly with the changes that are occurring in the ecosystem. This tutorial aims to help get you started in order to do just that.

> Pro-tip: If you are using vscode and would like editor intelligence check out [reason-vscode](https://marketplace.visualstudio.com/items?itemName=jaredly.reason-vscode).

### Specifications 📚

*   node@11.15.0
*   react@16.8.5
*   @babel/core@7.7.5
*   bs-platform@7.0.1
*   reason-react@0.7.0

### Dependencies 👶

First initialize the project with yarn.

```bash
yarn init -y
```

Next, install the dependencies for the project.

```bash
yarn add react@16.8.5 react-dom@16.8.5 reason-react bs-css normalize.css
```

Next, install the dev dependencies.

```bash
yarn add --dev @babel/core @babel/preset-env @babel/preset-react babel-loader bs-platform clean-webpack-plugin concurrently html-loader html-webpack-plugin webpack webpack-cli webpack-dev-server style-loader css-loader
```

### Folder Structure

Nowadays I like to keep the folder structure of my applications as flat as possible. Only when explicit and discernible patterns emerge will I start to place files in separate folders. This prevents the app from becoming too rigid at the start, which makes it easier to change later on.

Here is what the folder structure will be for this application:

```
.
├── lib
│   └── es6\_global
│       └── src
│           └── App.js
├── src
│   ├── App.re
│   ├── client.js
│   └── index.html
├── .gitignore
├── .merlin
├── .node-version
├── .nvmrc
├── .yarnrc
├── README.md
├── bsconfig.json
├── package.json
├── webpack.config.js
└── yarn.lock
```

> Pro-tip: To create a tree structure like what I have above I ran the mac os command `tree -a --dirsfirst -I ‘node_modules|bs|.git’` on my directory.

Let’s get the simple stuff out of the way first. The `.merlin` file is auto-generated. If you read through it, you will see it points to the local reason libraries, found in `node_modules`, the BuckleScript compiler will use in order to compile the modules correctly. The compilation process is also based on the settings found in the `bsconfig.json` file. Obviously, `yarn.lock` lists the exact dependencies of the project, which creates more deterministic builds. A condensed version of the dependencies and dev dependencies are listed in `package.json`. Our webpack config is found in `webpack.config.js`. I wanted to lock down dependencies and the node engine so I added `.yarnrc`, `.node-version`, and `.nvmrc` files.

Now the not so obvious stuff. The `src` folder will hold all of our front-end assets. You will render using JavaScript/React but build components in ReasonReact. These components will output to the `lib` folder. The `index.html` file will be a template and you will use `html-webpack-plugin` to inject the bundle script into the markup. The `build` folder will be where your output goes. It’s not as important for development as it is for production.

### BuckleScript 👢

In order to use reason how you would like to you need to set up a `bsconfig.json` file.

More information about the `bsconfig.json` spec can be found [here](https://bucklescript.github.io/bucklescript/docson/#build-schema.json).

### Webpack 🕸

Next, you will need to set up your webpack config.

### HTML 🦕

Next, you will create the HTML template which webpack will use to inject the script that points to the JavaScript bundle.

### Reason 😌

Now you can start writing some reason. Create a simple stateless reason component and export it so it can be used inside of `client.js`.

### JavaScript 😡

Now with all that in place you can add the little bit of JavaScript you will need to make it work.

### Scripts 📜

In order to get this to work, you need to run some commands. You will put these commands inside of the `scripts` property in `package.json` for convenience.

The secret sauce here is using `concurrently`. When files change in reason, BuckleScript will update those changes in the `lib` folder, which will cause the JavaScript in `client.js` to change, which webpack will recompile using hot module replacement. Pretty cool, huh?

Now run `yarn start` to see if this actually works. If it doesn’t, then go to the repository [here](https://github.com/arecvlohe/reason-react-starter) and clone it 😄. If it does work, good for you, you know how to copy/paste really well.

### Type Safe CSS 🎨

I want to briefly show how you can write type safe styles in ReasonReact using `bs-css`. I will create some styles using `bs-css` syntax which will highlight some of its features.

The first thing you probably noticed with the styles is that they are in camelCase, same as if you were writing them using the DOM or as a style prop in React. However, there are parentheses after, not colons. This is because the style declaration is a function. The function will take a parameter but the parameter needs to be type safe as well. For example, for the property `maxWidth`, it accepts a `Css.length`. Here I am using `px` for pixels that accepts an `int`, aka integer. You can also write this as `px(500)` as well. Type in a float instead of an integer, for example `500.0`, and see the compiler yell at you.

This expression has type float but an expression was expected of type int

You probably also noticed labeled parameters like `~v`. In the case of `margin2`, this stands for the vertical margin, whereas the `~h` stands for the horizontal margin.

And lastly, you noticed the styles can be dynamic as well. Simply create a function and pass in the parameter in order to make the style change based on what is supplied.

### Summary 🎬

In this article, you learned how to “easily” set up a ReasonReact project. Hopefully, this gets you up and running without too much hassle. Along the way, I hope you learned the importance of each file and configuration decision. From here you can build out a simple front-end application. If you are inspired to do more such as server-side rendering then check out [razzle](https://github.com/jaredpalmer/razzle/tree/master/examples/with-reason-react) and gain inspiration from their setup.
