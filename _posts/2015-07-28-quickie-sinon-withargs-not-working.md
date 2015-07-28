---
layout:     post
title:      "Quickie: Sinon.JS withArgs not working"
date:       2015-07-28
summary:		"Sinon.JS is peculiar about creating stubs using `withArgs` inline"
categories: javascript
tags:       [sinonjs, javascript, testing]
---

From time to time we run into a bit of an edge case when using [Sinon.JS](http://sinonjs.org/)
`withArgs()` - it seemingly does not work. Sinon `1.15.4` ignores `withArgs()` validation
if creating the stub inline. This may cause failing tests to pass.

This will **not** work as expected:

```js
var inline = sinon.stub().withArgs(1).returns(true);

console.log(inline(1)); // true
console.log(inline(2)); // true // ???
```

This **will** work:

```js
var preInit = sinon.stub();
preInit.withArgs(1).returns(true);

console.log(preInit(1)); // true
console.log(preInit(2)); // undefined // great!
```

The problem here is that, while [fluent]({% post_url 2015-04-26-fluent-javascript %}),
Sinon doesn't quite work the way you would expect it to. You can chain the calls,
which gives the misleading impression that it remembers intermediate steps.

The fact that each step returns a seemingly simple stub only increases the confusion:

```js
console.log(sinon.stub().withArgs(1).returns(1)); // function stub() {...}
console.log(sinon.stub()); // function stub() {...}
```

The last `returns()` call gives a stub that always returns whatever
it's argument was and disregards previous definitions:

```js
var typeDetector = sinon.stub()
  .withArgs(sinon.match.string).returns('I am a string') //ignored
  .withArgs(sinon.match.number).returns('I am a number');

typeDetector('definitely a string') // returns 'I am a number' :(
```

Here's a [Plunker](http://plnkr.co/edit/ySNFvV6mEaeYdOPiH5Gq?p=preview) replicating it.
Open the console to see the behavior.
