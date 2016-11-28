---
layout:     post
title:      "Naming Things: Avoid \"Handlers\""
summary:    "Method names should tell you what they do, rather than how they're used"
categories: javascript
comments:   true
tags:       [javascript, programming]
---

As tradition dictates, this post _should_ start with the obligatory quote
about the two hard things in computer science. Instead, to keep things DRY,
let's just assume we've all already thought of it anyway.

Have you ever come across a 127 line function that does a bunch of computation,
calls multiple endpoints, uses all sorts of asynchronous flows and such and
is called `handleClick`? Of course, since all programming is a deadly dance with irony,
the only place it appears to be used has nothing to do with clicking anything.
So you sigh heavily, roll up your sleeves and set aside the next few hours to
figure out what it actually does.

Every large code base contains these poor ill-named functions.
With names such as `onClick`, `onLoad`, `onInit`, `handleImageLoad`, `handleChanged`, `handleEnter`,
it's always like a little murder mystery you get to solve.
Except the victim is your sanity and the suspect left the company 2 years ago.

The laziest method names are those that spell out _how they're used_. They often
don't convey any significant information and could mostly be left out entirely.
Instead, methods should named for _what they do_. You should never have
to read a function body unless you care about how it does what it does.

## So what's wrong with `handleSomething`s?

### They hide the high-level structure

I believe some actual code makes the point much better than I ever could.
Can you tell what this class does?

```javascript
class Mystery {
  handleDragEnter() {
    // ...  
  }
  handleDragLeave() {
    // ...
  }
}
```

If you can, I regret to tell you that the [One Million Dollar Paranormal Challenge](https://en.wikipedia.org/wiki/One_Million_Dollar_Paranormal_Challenge)
has unfortunately been cancelled and you might have missed out on some serious cash.
How about this one?

```javascript
class Mystery {
  showDropZone() {
    // ...  
  }
  hideDropZone() {
    // ...
  }
}
```

Much easier, right? It is of course an excerpt from a component for uploading files.
The method names themselves hint at the broader structure and meaning of the code
surrounding them.

Naming methods for what they do is crucial for quickly scanning modules and components
and for actually finding what you care about.

### They tell you nothing

Say we're making an awesome slideshow gallery with preloading
(since we're rolling our own implementation instead of using _ReactReduxImageSlider.js_,
this scenario is somehow set in 2007).
We need to know when our images have finished preloading so that we can mark them as viewable.
So we go ahead and prototype out the following:

```javascript
function onLoad(image) {
  viewableImages.push(image);
}

image.onload = () => onLoad(image);
```

So here we are. We've just started implementing something and we've already wasted
12 characters. _Of course_ whatever we assign to `onload` will happen when the image loads.
We don't need to repeat ourselves. Instead, we should let the reader know what happens when the image loads:

```javascript
function markAsViewable(image) {
  viewableImages.push(image);
}

image.onload = () => markAsViewable(image);
```

We should always strive to make our code self explanatory
(I've waged my little war on [pointless comments]({% post_url 2015-04-26-fluent-javascript %}#comments-considered-harmful)
for a while now). Naming functions after the hooks they plug into does little to explain intent.

### They prevent reusability

Say you've gone ahead and named some method `handleClick`. It's very simple -
all it does is toggle a dropdown. All is good, until one night three months later
you suddenly wake up drenched in cold sweat, single thought in mind - _people have keyboards_!
You rush to your workstation, swat away the empty coffee cups and pizza boxes,
open up your favorite editor and start implementing... `handleEnter`?

_This would never happen_, you say, _I would rename it_, you add. You're right,
but since it's been three months already you have to figure out if it's being used somewhere
already, and _oh it's used 17 times in the template_ and your editor does not support
cross-file refactoring and now you have to spend 10 minutes just renaming things,
like some sort of savage.

Instead, had you named the method `toggleDropdown`, you would have saved yourself
the effort and made it self-explanatory. Then all you would have had to deal with was
setting up the event handler and looking up the keycodes and _oh look it's 6am already_.

### They're often flat out wrong

When confronted with the previous scenario, some people choose a path other than refactoring.
In an almost humanitarian effort to empower blocks of code,
they push their poor methods to do _more_.

```javascript
toggler.onkeydown = handleClick; // sheer madness
```

Things change, sometimes drastically (the _true_ hard problem in computer science).
Business logic changes, methods get moved around, blocks of code vanish, functions get reused.
If you name a function for how it gets called, you're anchoring your code to a moment in time.
Any time you change your flow or requirements, you'll likely have to rename the method as well.

Outdated function names are worse than outdated comments -
the latter at least don't make it to stack traces.

### They kill single responsibility

Methods with generic names tend to become a gathering bin for all sorts of random
code which is rarely related. It's much easier to justify
putting an HTTP request into a function called `onLoad` rather than one called
`showMenu`.

```javascript
function onLoad() {
  menu.show();
  fetch('settings', ...); // A-OK!
}

function showMenu() {
  menu.show();
  fetch('settings', ...); // uhh, is this really the right place for this?
}
```

The better alternative is to describe the flow in
higher-level steps, such as `showMenu()` and `loadSettings()`. These can then be
grouped under even higher-level functions such as `initAndDisplaySettingsMenu()`, i.e.:

```javascript
function initAndDisplaySettingsMenu() {
  loadSettings();
  showMenu();
}
```

## Caveat: external interfaces

There is one place where naming functions for how they get called is completely
acceptable and even recommended - external interface hooks.

For example, take Angular components. There's a way to one-way bind to an outside
expression, exposing an interface:

```javascript
angular.component('myButton', {
  bindings: { onClick: '&' },
  controller() {},
  template: `
    <button type="button" ng-click="$ctrl.onClick()">My Button</button>
  `
});
```

```html
<my-button on-click="$ctrl.finishEditing()"></my-button>
```

External interfaces are there to be consumable, so being as clear and obvious as
possible about how they behave is the best strategy here.

Notice that even though we use `onClick()` for the outside interface name, we're
still naming our actual business logic appropriately
(`finishEditing`, rather than `handleClick` or something like that).

## A rose by any other name...

... misleads and wastes the reader's time! Understanding code would likely still be
an exercise in silent anger even if everything was labelled perfectly. Meanwhile,
the best we can do is make our code as explicit as possible -
at least if we explain ourselves, they might not throw away the madhouse keys.
