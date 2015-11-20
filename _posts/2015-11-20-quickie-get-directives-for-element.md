---
layout:     post
title:      "Quickie: get directives for an Angular element"
date:       2015-11-20
summary:		
categories: angular
tags:       [angular, javascript, directive]
comments:   true
---

Unfortunately, this is not entirely trivial. I'd love to give you a snippet you can paste into console,
but so far this is the best I've come up with. Anyhow, here's a way to inspect the directives of an element:

Set a breakpoint in the `compileNodes()` function in the Angular source somewhere
after the `collectDirectives()` method call:

<img src="/images/quickie-get-directives-for-element/breakpoint.png">

Then paste the following into your console:

```js
el = document.querySelector('<your element selector>'); //get your element somehow
angular.element(document.body).injector().get('$compile')(angular.element(el));
```

You'll be able to see the directives in result of the `collectDirectives()` method call,
which the non-minified case will be `directives`:

```js
console.log(directives);
> [
    {
      "restrict": "A",
      "controllerAs": "ctrl",
      "template": "{{ctrl.prop}}",
      "priority": 0,
      "index": 0,
      "name": "attrDirective",
      "require": "attrDirective",
      "$$bindings": {
        "isolateScope": null,
        "bindToController": null
      },
      "$$moduleName": "App"
    }
  ]
```

You can also get a list of all the directives registered on the current `$injector`,
which is usually going to be all the directives in your app:

```js
console.log(hasDirectives);
> [/* all directives registered on the $injector */]
```

Obviously this is going to be a little trickier if you're working with minified code
but the same principles apply and you can work out the equivalent variables to query.

Let me know if you have a better method!
