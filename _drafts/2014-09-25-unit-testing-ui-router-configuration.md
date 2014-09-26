---
layout:     post
title:      Unit Testing ui-router Configuration
date:       2014-09-25 21:16:00
summary:    "How to unit test your ui-router configuration"
categories: angular ui-router javascript
---
### Why?

In Angular, configuration is code, so one could argue there is no real
reason not to test it. If you misconfigure your application, it's
no less threatening than a bug in some controller or service.

End-to-end testing can (and should) be used to verify major functionality.
It is, however, rather more difficult to write and maintain. In contrast,
unit tests let you test the details at very impressive speeds.

Unit testing the `.config()` blocks in your Angular app seemed a daunting
task at first. You can't easily access the providers (tests run after
the config phase is over) and there is usually a lot of stuff that gets
bootstrapped along even for the tiniest of tests.

There is however a rather painless way of testing at least the routing of your
app, which is usually where a lot of the important logic happens.

### Separate routing from the rest of your configuration

The key concept in unit testing anything is making it independently testable and
ui-router configuration is no exception.

In order to do this, you should extract anything related to ui-router into a
separate module, then require that in your main app module. It's a simple
refactoring that gave us immediate benefits, even
without the tests - in my experience, ui-router can drown out everything else
in the configuration phase. This makes it easy to see at a glance the high-level
logic of your app, makes the rest of your modules easier to test (you don't have
to bootstrap the entire routing if you don't want to).

I feel including ui-router as a dependency in the routing submodule is also wise
as it keeps the implementation details hidden. In theory, you could replace
ui-router with a different routing library in the future and there would be less to change.
We used something like this:

```
// routing.js
angular.module('someApp.routing', ['ui.router'])
  .config(function($stateProvider, ...){
    ...
  });
```

```
// app.js
angular.module('someApp', ['someApp.routing', ...])
  ...
```

### Helpful utilities

Here's handful of key utilities that we've been using to streamline
the unit testing of our ui-router configuration. You'll find these
scattered about in the examples below.

* `mockTemplate(url, [template])`

  Since ui-router will by default try to retrieve your views, we use
  this tiny function to mock a template for a specific route.

  ```
  function mockTemplate(templateRoute, tmpl) {
    $templateCache.put(templateRoute, tmpl || templateRoute);
  }
  ```

* `goTo(url)`

  Literally takes you to the specified URL and then does a $digest.
  Simply to make tests look more readable.

  ```
  function goTo(url) {
    $location.url(url);
    $rootScope.$digest();
  }
  ```

* `goFrom(url).toState(state, [params])`

  This is used mainly to check `onEnter` and `onExit` blocks, as you
  actually need to do the state transition. We prime the `$location`
  so that the ui-router does not immediately go somewhere different on
  `$scope.$digest()`.

  ```
  function goFrom(url) {
    return {toState: function (state, params) {
      $location.replace().url(url); //Don't actually trigger a reload
      $state.go(state, params);
      $rootScope.$digest();
    }};
  }
  ```

* `resolve(value).forStateAndView(state, [view])`

  Resolve blocks are a bit tricky to test, so this is what I've been
  using personally. It's a bit weird, but it essentially lets you execute
  the resolve as if you were ui-router. It uses `$injector` to get you the
  fully wired up version of the resolve result.

  ```
  function resolve(value) {
    return {forStateAndView: function (state, view) {
      var viewDefinition = view ? $state.get(state).views[view] : $state.get(state);
      return $injector.invoke(viewDefinition.resolve[value]);
    }};
  }
  ```

* `emitStateChangeEvent(type, toState, fromState)` ?

### URL routing

One of the most important things to check is whether your routing matches
your expected state transitions. This is where you test all your
`$urlRouterProvider` `.when()`, `.rule()` and `.otherwise()` blocks.
This is also where you can check whether your state url mappings are what
you expect them to be.

Since actions speak louder than words, here's an example.
Say you have the following configuration:

```
...
.config(function ($urlRouterProvider, $stateProvider) {
  $urlRouterProvider
    .when('', '/home')
    .when('/', '/home')
    .otherwise(function ($injector) {
      $injector.get('$state').go('404', {}, { location: false });
    });

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: 'views/home.html'
    })
    .state('404', {
      templateUrl: 'views/404.html'
    });
});
```

The test structure for URL routing would then look something like this:

```
describe('path', function () {
  describe('when empty', function () {
    beforeEach(mockTemplate.bind(null, 'views/home.html'));
    it('should go to the home state', function () {
      goTo('');
      expect($state.current.name).toEqual('home');
    });
  });
  describe('/', function () {
    beforeEach(mockTemplate.bind(null, 'views/home.html'));
    it('should go to the home state', function () {
      goTo('/');
      expect($state.current.name).toEqual('home');
    });
  });
  describe('/home', function () {
    beforeEach(mockTemplate.bind(null, 'views/home.html'));
    it('should go to the home state', function () {
      goTo('/home');
      expect($state.current.name).toEqual('home');
    });
  });
  describe('otherwise', function () {
    beforeEach(mockTemplate.bind(null, 'views/404.html'));
    it('should go to the 404 state', function () {
      goTo('someNonExistentUrl');
      expect($state.current.name).toEqual('404');
    });
    it('should not change the url', function () {
      var badUrl = '/someNonExistentUrl';
      goTo(badUrl);
      expect($location.url()).toEqual(badUrl);
    });
  });
});
```

We use `$state.current.name` to check whether the transition happened
as we had expected it to. Since we have access to the current state, we could
do a more elaborate expectation here if necessary.

The tests themselves are arguably clear, concise and easy to read. I use
the `beforeEach` statements liberally because they make it easy to add new
tiny micro-tests for any other behaviour I want to verify.

As a bonus, we implicitly check whether the correct view is being loaded.
If this is unwanted, you could mock out `$templateCache` to always return
whatever the argument was. I could see that being useful if your views have
a ton of views that make it cumbersome to always mock them out explicitly.

This pattern can be used to test pretty much anything to do with URL mapping,
including any state parameters, `.rule()` blocks and such. As they say, sky's
the limit here.

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
