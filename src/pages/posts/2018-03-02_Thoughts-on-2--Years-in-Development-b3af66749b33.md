---
title: "Thoughts on 2+ Years in Development"
description: "Ramblings on Being a Developer"
publishDate: '2018-03-02'
layout: ../../layouts/BlogPost.astro
---

It’s been a little over 2 years since I started my first gig as a developer. During that time I did all I could to level-up my game. This is because even though I landed a job in the field, I felt ill-equipped to handle a great amount of complexity. Yes, I could work within a React framework, but could I build an entire front-end architecture? Probably not. Knowing this drove me to continue to expand my thinking and challenge myself. Keep in mind, this was during a phase where it seemed a new JS library was coming out every day. Things are now settling down and the tools used are more standardized. A lot changed over the past couple years and I would like to share thoughts on what I have learned.

### Shiny New Objects ✨

One of the reasons I wanted to be a developer is because I enjoyed learning about new technology. Let’s just say I wasn’t disappointed. These past two years saw a renaissance in front-end development and it was hard to keep up. I remember I did a workshop one night on the topic of higher order components. First, I showed how to pull down babel dependencies and get webpack setup in order to use ES2015 features. One non-JS developer in the back chuckled, I think, because of the amount of complexity just to get started.

Thankfully, the JS community has focused on developer experience and working toward a more seamless adoption of new tools. Don’t get me wrong, though. I do like learning new things but at the same time, I thought my brain was going to explode with everything I needed to learn. To those who started around the same time, you are not alone in feeling inept at times. If nothing else, it feels good to know I can setup webpack in case I want to really impress someone.

### FP All the Things λ

As I entered the field, functional programming was gaining a lot of attention. Declarative programming was all the rage and I jumped on the bandwagon. One of the first lessons I took was [Jafar Husain’s Functional Programming in JavaScript](http://reactivex.io/learnrx/). After that point, I was hooked. At least for me, the mental model just made sense. I was using `map`, `filter`, and `reduce` in all my front-end portfolio projects. When learning React, it came a bit easier because I was already comfortable with mapping over an array of items. I was fascinated with this paradigm and I started learning other languages like Elm, PureScript, and ReasonML. The utility library I use at work is Ramda.

This became important for other reasons too. Using a language like Elm introduced me to the concept of types. The front-end is now an incredibly complex architecture and JavaScript is an incredibly fragile language. This is to say, you can break your application in more ways than you would like. Using tools like Flow, or TypeScript, adds some guarantees to your project and helps to prevent breakage and at the same time adding metadata to the code base. This metadata allows a developer to quickly scan a part of the code and gain much-needed insight from type declarations. I think this makes me a much better developer because I think in greater detail about my application. Type checking is not strictly an FP concept. I just so happened to learn it from a purely functional language in Elm.

### Live Streaming 📺

The culmination of all this learning led me to blabber about what I know on [Twitch.TV](https://www.twitch.tv/adamrecvlohe). I use this medium to force to me to stay up-to-date on languages like Elm and ReasonML. I don’t use these languages at work but I enjoy using them when I get a chance and I want to keep my skills sharp. Another reason for streaming about these languages is they may be difficult for beginners. As I have said previously, the greater JS community is aspiring to make learning a new language or tool as seamless as possible. The build setup for both of these languages is top-notch. However, trying to convey the concept of Maybe/Option may not be easy for beginners. I hope that whoever watches can glean some deeper understanding of functional programming techniques and how they help build more resilient applications.

There is no better way to truly question what you know than through conveying it to another person. That is why I enjoy streaming. It makes me think about what I know and articulate what I am trying to achieve. This is not something I do at work. Usually, when I am at work I am solely working to achieve the task given to me. Yet, when I have to discuss something in an open setting, such as on a stream, I am forced to provide a more coherent reason for why I chose to do something a certain way. This, in turn, helps me to refine my understanding of the topic while hopefully helping others understand it too.

### Open Source 👨🏻‍💻

Contributing to an open source project is one of my proudest moments. In many ways, it’s a rite of passage for those who work in web development. Day in and day out, I leverage open source libraries to ship applications to real customers. The rate at which I ship features would be magnitudes slower without these libraries at my disposal. Finally being competent enough to give back to the community that supported me is a great feeling.

The project I am talking about is [react-big-calendar](https://github.com/intljusticemission/react-big-calendar). It’s a great project and is, at least in my mind, a great starting point if your project involves a calendar. My efforts in the project dealt mostly with enhancing the resize functionality of events on the calendar. [It was a massive undertaking that took a few months but I was incredibly happy when it was finally merged](https://twitter.com/adamrecvlohe/status/951822988999000065?s=20). It wasn’t just my work either. I partnered and got feedback from other community members to start it and make it better. Now I am a project contributor and I hope I can continue to improve the project over the next few years.

### Meetups 👋

When I first started learning to code, at the start of 2015, it was important to me that I was active in the developer community. I did this for a few reasons. I thought that if I taught what I knew it would reinforce what I learned and help me to learn faster. I started out teaching HTML/CSS courses to teens and children. Whenever I learned something new I would teach it to someone whether it be through a course, workshop, or presentation. I got involved in meetup groups like [Suncoast.js](https://mobile.twitter.com/suncoastjs) and even started one of my own called [Code Katas](https://mobile.twitter.com/code_katas). My goal is to grow the developer community in Tampa Bay and make it a hub for innovation. In a few years, maybe people will think of Tampa Bay as on par with other tech cities like Los Angeles and New York.

Presenting at meetups is very much like live streaming. Live coding is hard enough. Doing it in front of a group is even harder. And yes, something will go wrong. But connecting with the community is a great experience and it’s awesome to see newcomers get their feet wet with a challenging code kata.

### Conclusion

Two plus years can go by pretty quickly. It’s nice to take a step back and reflect on what I have accomplished up to this point. There is still more I want to accomplish but I need to remember it takes time. It would be great if I had all the skills of a Senior Developer instantly, but where is the pain and suffering in that?

My thoughts list some of the pointers I would give someone if they are just getting into development. If you are wondering what can help you along your path, look no further than your community. The community does’t have to be local. It can also be a remote community. Either way, engage yourself with those with similar interests and see what you can build together. It can only help to improve you along your path as a developer.

_Natives in Tech is a coalition of Native and non-Native software developers whose goal is to support software application development that reinforces Native beliefs, knowledge, and identity. This is achieved through four initiatives: networking with aspiring and experienced developers alike, creating a strong social media presence on platforms familiar to developers, hosting a yearly Natives in Tech conference, and building open source software that Native peoples can use to cultivate healthy online communities. Learn more at_ [_https://nativesintech.org/_](https://nativesintech.org/)_._
