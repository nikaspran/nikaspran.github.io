---
layout:     post
title:      "Practical JS: Maybe Promises"
date:       2016-09-09
summary:    "DRY up optionally asynchronous flows"
categories: javascript
comments:   true
tags:       [practical js, javascript, node]
---

Sometimes, you want to optionally wait for a promise before performing some synchronous code.
The most obvious solution unfortunately leads to some duplication:

```js
function onExit() {
  if (hasChanges) {
    showConfirmationModal()
      .then(() => goToHomePage());
  } else {
    goToHomePage();
  }
}
```

The more complicated a flow gets, the more unwieldy it becomes.
A good way of dealing with this is by introducing what I sometimes call a *maybePromise*:

```js
function onExit() {
  const maybeConfirmExit = hasChanges ? showConfirmationModal() : Promise.resolve();
  maybeConfirmExit.then(() => goToHomePage());
}
```

This can really simplify more complicated flows which include more than one optional gate:

```js
function onExit() {
  const maybeConfirmExit = hasChanges ? showConfirmationModal() : Promise.resolve();
  const maybeNotifySessionEnded = () => otherSessions.length ? notifySessionEnded() : Promise.resolve();

  maybeConfirmExit
    .then(maybeNotifySessionEnded) // !important, maybeNotifySessionEnded is an arrow function
    .then(() => goToHomePage());
}
```

This works really well in Angular 1 too, where you can use `$q.when()` instead of the ES6 `Promise.resolve()`
