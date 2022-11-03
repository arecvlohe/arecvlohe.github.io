---
title: "Let’s Build a Local Weather App in Elm"
publishDate: "2017-04-29"
layout: ../../layouts/BlogPost.astro
---

### Objectives

- Learn about and implement the Elm architecture focusing on how to make it interoperable with JavaScript through ports and subscriptions.
- Go over how to split up your Elm project into modules.
- Utilize Json.Decoder to transform JSON into Elm.
- Integrate Elm Github libraries into your project.
- Create a simple local weather app with the help of the Navigator API.

### Editor

- VSCode

### Resources

- [Elm Docs and Packages](http://package.elm-lang.org/)
- [Elm-Jsonp](https://github.com/paramanders/elm-jsonp)
- [Elm Ops Tooling](https://github.com/NoRedInk/elm-ops-tooling)

### PART 1

#### Intro

Elm has many great features, from the Elm Architecture to type aliases to compiler error messages. Another great feature is Elm’s interoperability with JavaScript through ports and subscriptions. `Ports` allow information to be passed between my Elm application and the JavaScript on the front-end. `Subscriptions` allow me to consume data coming through `ports` from the front-end so that I can pass it to my `update` function and make changes to my `model`.

In this lesson, I will build a local weather app that is probably one of the ugliest apps you will ever see. You definitely won’t ever see this app on [Awwwards](https://www.awwwards.com/). However, this lesson is about learning Elm, so I hope you don’t mind because I sure don’t!

Unfortunately, in this lesson I won’t be using [Ellie](https://ellie-app.com/new), the friendly Elm editor. I need to be able to use a couple Github repositories and getting down and dirty with Elm in [VSCode](https://code.visualstudio.com/) seems like the most logical solution. There really isn’t a whole lot to do to get started using Elm in VSCode. First, you should [download Elm](https://guide.elm-lang.org/install.html) and get it on your local machine/computer.

I highly recommend using [elm-format](https://github.com/avh4/elm-format) with VSCode, it will make your code all nice and purty and format it according to Elm conventions. I think that is all you will really need for this lesson. Enough with the formalities. Let’s start coding.

To start I will first dive into the folder structure of the app. The final outcome will look a little something like this:

dist/
index.html
main.js
elm-stuff/
node_modules/
scripts/
elm-ops-tooling/
src/
Main.elm
Ports.elm
Types.elm
vendor/
elm-jsonp
.gitignore
elm-package.json
package.json

The compiled output of the `src/Main.elm` will be to `dist/main.js`. One of the Github repos I am using is `elm-jsonp` which you can see is under `vendor`. I need to run a python script to port over `elm-jsonp` into my `elm-stuff` so I am using another Github repo, `elm-ops-tooling`, to do the grunt work in that area. Nothing too busy going on here, just wanted to provide an overview of the project before I got into the meat and potatoes.

To begin I will get into the `index.html` file. Here I will write the scripts that send information to the Elm app. In the body of the `index.html`, I am adding a `div` with a `class` of `main`. Then I am adding a `script` tag whose `src` is my `main.js` script, which doesn’t exist now but will exist soon.

Then I add another `script` tag that does a couple things. First, it instantiates my Elm app and embeds it to the DOM. Second, it calls a function that asks the user if they want to share their location. If the user agrees to share their location, the user’s geolocation information will be sent through a port to the Elm app. If they do not, I will send an error to another Elm port.

In this lesson, I won’t be showing any error handling but I will provide the mechanisms to do so. As a good software developer, you should implement views for all user experiences but I will just be demonstrating the “happy path,” a.k.a. when things go right. The outcome of the `index.html` file should now look like this:

```html
<body>
  <div id="main"></div>
  <script src="main.js"></script>
  <script>
    var node = document.getElementById("main");
    var app = Elm.Main.embed(node);

    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(success, failure);
    }

    function success(position) {
      const coords = position.coords;
      const latitude = coords.latitude;
      const longitude = coords.longitude;
      app.ports.position.send({ latitude, longitude });
    }

    function failure(error) {
      const code = error.code;
      const message = error.message;
      app.ports.error.send({ code, message });
    }
  </script>
</body>
```

This won’t actually work if I try to open `index.html` in a browser because I don’t have a `main.js` file in the directory. This makes `Elm` in the `script` tag undefined. To fix this I will move on to my Elm files and work on rendering my coordinates on the screen.

In my src directory, I will create the files I need: `Main.elm`, `Ports.elm`, and `Types.elm`. In my `Types.elm` file, I will add two types: `Position` and `Error`. The `Position` type will be quite simple, it will have two fields that are both floats: `latitude` and `longitude`. The Error type will also have two fields, `status` that will be an integer and the `message` that will be a string. My `Types.elm` file will look like this:

```elm
module Types exposing (..)

type alias Position =
   { latitude : Float
   , longitude : Float
   }

type alias Error =
   { status : Int
   , message : String
   }
```

Modeling my types is great because it ensures the data I pass around my application is in the shape I expect. If my `view` expects my `model` to have a `position` of `latitude` and `longitude` and instead I put `lat` and `lng`, I will get a compile error telling me to update my `view` because it was expecting a value other than `lat` and `lng`. Better to catch these pesky bugs before the program is compiled then to see them at run-time!

In my `Ports.elm` file, I will add the ports that I need to get my `position` or the `error` if the server fails to return back my coordinates. I will pull in the types I need so that the `port` correctly parses the JavaScript data before it comes part of my `model`.

```elm
port module Ports exposing (..)

import Types exposing (Position, Error)

port position : (Position -> msg) -> Sub msg

port error : (Error -> msg) -> Sub msg
```

When the JavaScript data comes through the `port` Elm makes sure it adheres to the type, either `Position` or `Error`, and then sends out a `Sub msg` that the `update` function listens for. When the `update` function gets my `Sub msg` I can then update my `model` accordingly and render a new `view` with my local coordinates.

To render my local coordinates I need to wire up my `Main.elm` file. I will first start with my `model` since that is what my `view` is based on. My `model` is pretty simple at the moment, it will have `position` and `error` fields based on you guessed it, `Position` and `Error` types.

```elm
type alias Model =
    { position : Position
    , error : Error
    }
```

I will be using Elm’s `Html.program` which means I need an `init` function. Again this will be pretty basic. It will have placeholder values for both the `position` and `error` fields when the app initializes.

```elm
init : ( Model, Cmd Msg )
init =
 ( Model (Position 0.0 0.0) (Error 0 ""), Cmd.none )
```

Lets move on to our messages that send updates to our `update` function. I have two messages that are important at the moment and both come from our `subscriptions`:

```elm
type Msg
    = NewPositionMsg Position
    | NewErrorMsg Error
```

These messages are what the `subscription` sends to our `update` function. If we get the coordinates then a `NewPositionMsg` with the actual `Position` coordinates are sent to update. From there I can update my `model`. The `subscription` can also send a `NewErrorMsg` with the `Error` in case it errors on me. With these messages in mind, I can now update my `subscriptions` function.

My `subscriptions` take in values and send out a `Sub Msg` based on those values. I am listening for both a `position` and an `error` so I will need to use `Sub.batch` to handle multiple `subscriptions`.

```elm
subscriptions : Model -> Sub Msg
subscriptions model =
    Sub.batch
        \[ position NewPositionMsg
        , error NewErrorMsg
        \]
```

The `update` function will listen for these `subscriptions` and make updates to the `model` accordingly. Here is how I am handling those `subscription` messages in my `update` function:

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewPositionMsg position ->
            ( { model | position = position }, Cmd.none)
        NewErrorMsg error ->
            ( { model | error = error}, Cmd.none )
```

Pretty simple, right? I am updating my model based on the `subscription` message. If it’s a `NewPositionMsg` with a `position`, I update my `position` field on my `model` with the new `position`. If it’s a `NewErrorMsg`, I update my `error` field in my model with the new `error`. Nothing too crazy going on here. Now I will define my `view` function.

```elm
view : Model -> Html a
view model =
    div \[\]
        \[ div \[\] \[ text (toString model.position.latitude)  \]
        , div \[\] \[ text (toString model.position.longitude) \]
        \]
```

Again, nothing crazy going on here. Just rendering my `view` based on the `model`. As you can tell I am not rendering any `view` for my `error`. I leave that up to you 😉!

Now time to wire this up!

```elm
main : Program Never Model Msg
main =
    Html.program
        { init = init
        , update = update
        , subscriptions = subscriptions
        , view = view
        }
```

I am at the midway point and I have been driving a little blind because I haven’t checked to see if this thing actually works. Let’s see this thing in action!

To compile my code more effectively I am using a couple `npm` packages: `elm` and `chokidar-cli`. These packages allow me to compile my Elm files on every save. In my `package.json` I have three `npm` commands.

```javascript
"start": "npm run watch:elm",
"watch:elm": "chokidar '\*\*/\*.elm' -c 'npm run build:elm' --initial",
"build:elm": "elm make src/Main.elm --output dist/main.js"
```

This idea for compiling using `npm` came from Maximillian Hoffman in this [blog post](https://maximilianhoffmann.com/posts/how-to-compile-elm-files-on-save).

Now if you run `npm init -y` to create an `package.json` file and then add the scripts above to `scripts` in the `package.json` and then run `npm i -D elm chokidar-cli` and then run `npm start` at the root of your directory, it will almost work 😃.

The reason it doesn’t is because the Elm compiler cannot find our Elm files, which are in `src/`. At this point though an `elm-package.json` has been created. We need to update `source-directories` in the `elm-package.json` from being `.` to `./src`. If you run `cmd + c` and then run `npm start` again you should successfully compile your Elm files into `main.js` and see it sitting comfortably in your `dist` folder.

Now if you open `dist/index.html` in a browser you should be prompted to share your location, and not too long afterward you should see your coordinates on the screen.

Now you can take a breather and grab a bite to eat or some fresh air, you earned it!

Here is the code up to this point: [code](https://github.com/arecvlohe/medium-demo-elm-local-weather-app/tree/part_1).

### PART 2

#### Intro

This is the part of the post that you will start to hate me. Things will get a tad complicated but hopefully not so bad that you start asking rhetorically, “really?!😡”

To set the foundation for this second part I need to pull in a couple projects from Github and create an account with [darksky.net](https://darksky.net), the API I will use to get the local temperature based on my coordinates.

If you haven’t already, head on over to darksky.net and create a developer account by clicking on the `Developers` tab at the top of the screen. Once you sign up, you will be redirected to your `console` where you will find your API key and a sample request. A sample request to the API will look like this:

[https://api.darksky.net/forecast/YOUR_API_KEY/37.8267,-122.4233](https://api.darksky.net/forecast/464271a84e193070f9a5d159c9574296/37.8267,-122.4233)

Darksky enforces strict CORS so I won’t be able to make this request from my browser. That is why I need to use `elm-jsonp` to make the request instead. I also will need to run a script to unpack `elm-jsonp` into my `elm-stuff` directory. For that, I will use `elm-ops-tooling`. I will now create two directories, `scripts` and `vendor`. `Scripts` will house `elm-ops-tooling` and `vendor` will house `elm-jsonp`. Head on over to Github and clone those repositories into their respective directories.

Once I have the repositories in their respective directories I will run a simple script, `elm_self_publish,` to unpack `elm-jsonp` and and add it to my `elm-stuff` directory. The command will look like this:

```bash
python scripts/elm-ops-tooling/elm\_self\_publish.py vendor/elm-jsonp ./
```

Now that `elm-jsonp` is self-published I can import the module into my `Main.elm`. However, for it to work correctly we also need the `elm-lang/http` library because `elm-jsonp` depends on it. To install `elm-lang/http` just run `elm package install elm-lang/http` in your terminal.

I want to begin adding functionality to my `Main.elm` so I will again start with my `model`. I will need to add a new field to my `model` for the temperature. My `model` will now look like this:

```elm
type alias Model =
    { position : Position
    , error : Error
    , temperature : Float
    }
```

Next, I will add a placeholder value to my `init` function. Otherwise, I will get an error saying that my `init` function does not adhere to the shape of the `model`.

```elm
init : ( Model, Cmd Msg )
init =
    ( Model (Position 0.0 0.0) (Error 0 "") 0.0, Cmd.none )
```

After that, I need to add a new message for my `update` function to listen for the new temperature I will get after hitting the Darksky API with my request. My `Msg` types will now look like so:

```elm
type Msg
    = NewPositionMsg Position
    | NewErrorMsg Error
    | NewTemperature (Result Http.Error Float)
```

I now need to create a helper function that will take my `latitude` and `longitude` and send a request to the Darksky API based on those coordinates. I will call this function `getTemperature`.

```elm
getTemperature : Position -> Task Http.Error Float
getTemperature position =
    let
        ( lat, lng ) =
        ( toString position.latitude, toString position.longitude )
    in
        Jsonp.get decodeTemperature ("https://api.darksky.net/forecast/YOUR\_API\_KEY/" ++ lat ++ "," ++ lng)
```

This function will take a `Position` and return send out a `Task` that returns either an `Http.Error` or the result, which will be a `Float`. I am also using a a `let` expression here to destructure two variables, `lat` and `lng`, which turn the `position.latitude` and `position.longitude`, which are floats, into strings.

If you notice there is another function called `decodeTemperature`. Elm does not automagically decode JSON into an Elm format. That is something I will have to do manually using a decoder. This makes sure that the information I get back from the API, which is JSON, can be added to my `model`, which is in Elm. I just need `temperature`, which is nested inside of another field called `currently`, so my decoder will look like this:

```elm
decodeTemperature : Decode.Decoder Float
decodeTemperature =
    Decode.at \[ "currently", "temperature" \] Decode.float
```

Next I need to change my `update` function to handle when the temperature comes in. Because I am sending a `Task`, that means I will receive two results. Therefore, I need two handlers, one for the successful response and one for the error. One other thing I need to do is update my `NewPositionMsg` action. Previously I was sending just a `Cmd.none` but what I want to send is an actual `Task` to the Darksky API. Therefore I will use `Task.attempt` that takes a Msg, in this case, `NewTemperature`, and sends out a request that is shaped by `getTemperature`. When the `NewTemperature` comes in I update my model with the temperature from the API.

My update function now looks like this

```elm
update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NewPositionMsg position ->
        ( { model | position = position }, Task.attempt NewTemperature (getTemperature position) )

        NewErrorMsg error ->
        ( { model | error = error }, Cmd.none )

        NewTemperature (Ok temperature) ->
        ( { model | temperature = temperature }, Cmd.none )

        NewTemperature (Err \_) ->
        model ! \[\]
```

My `view` will be updated as well. Nothing too crazy, just adding a `div` that shows the temperature.

```elm
view : Model -> Html a
view model =
    div \[\]
        \[ div \[\] \[ text (toString model.position.latitude) \]
        , div \[\] \[ text (toString model.position.longitude) \]
        , div \[\] \[ text (toString model.temperature) \]
        \]
```

If you did not realize already, you will need to pull in the new libraries at the top of the `Main.elm` file. They include:

```elm
import Http
import Jsonp
import Task exposing (Task)
import Json.Decode as Decode
```

Okay, if you run `npm start` your program should compile and if you open `dist/index.html` in a browser you should be prompted to share your location and if you do you should see your `latitude`, `longitude`, and `temperature` on the screen.

> Note: You may receive errors that say you have corrupted files. You may want to delete your `elm-stuff` folder and recompile your code.

You have reached the finish line 🏁, congratulations! Thanks for hanging in there. Here is the completed version of the app: [code](https://github.com/arecvlohe/medium-demo-elm-local-weather-app/tree/part_2).

I hope this lesson was helpful in describing how to work with ports and to either render data or kick off other actions based on that data as well as other Elm concepts.
