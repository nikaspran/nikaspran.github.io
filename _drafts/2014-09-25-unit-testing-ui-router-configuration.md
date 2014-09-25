---
layout:     post
title:      Unit Testing ui-router Configuration
date:       2014-09-25 21:16:00
summary:
categories: angular ui-router javascript
---
### Why?

* Configuration is code - you should test it
* BUT it's usually not easy to test
* You can test your ui-router configuration

### Separate routing from the rest of your configuration

* Anything to do with routing - separate module
* Require that in the main module
* Makes it fast and easy to bootstrap your test environment
* The rest of your app is easier to test as well

### Use helpful utilities

* `mockTemplate(url)` - allows you to have tiny beautiful code
* `goFrom(url).toState(state)`
* `resolve(value).forState(state).andView(view)`
* `emitStateChangeEvent(type, toState, fromState)` ?
* Use spies liberally

### URL routing

* Check whether routes correspond to proper state mappings
* Verify your `.when()`, `.rule()` and `.otherwise()` blocks
* Implicitly check whether the correct views are being loaded

### State logic

* `resolve` blocks
  * In controller tests you usually mock out the dependencies
  * So you should also test whether the dependencies actually get delivered
  * A bit unwieldy, that's why we use utilities
  * Can mock stuff to check various branches and such (`$stateParams`)
* `onEnter` blocks
  * Called when you get to the state
* `onExit` blocks
  * Requires setup - go to the state you're testing, then to another state

### `$stateChange*` events

* A few different ways:
  * Fake a state change
  * `reject()` your resolve blocks
  * TODO: look into more ways to do this

### Other notes

* You can test state transition chains by listening in on `$stateChangeSuccess`
* Utilise `beforeEach` a lot, keep tests small
* Could also test whether `controller` is correct
