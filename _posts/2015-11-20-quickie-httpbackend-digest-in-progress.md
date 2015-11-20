---
layout:     post
title:      "Quickie: $httpBackend flush() $digest in progress"
date:       2015-11-20
summary:		"Angular's $httpBackend reports a $digest in progress error when using both flush() and verifyNoOutstandingExpectation()"
categories: angular
tags:       [angular, javascript, testing]
comments:   true
---

[TL;DR](#solution)

When `flush()` and `verifyNoOutstandingExpectation()` `$httpBackend` methods are used together,
Angular mistakenly tries to do a double $digest if there's an error in one of your expectations,
which results in messy errors like this:

```
x service should work
  Error: Unexpected request: GET http://www.example.com
  No more request expected
      at $httpBackend (https://code.angularjs.org/1.3.20/angular-mocks.js:1263:9)
      at sendReq (https://code.angularjs.org/1.3.20/angular.js:9694:9)
      at serverRequest (https://code.angularjs.org/1.3.20/angular.js:9406:16)
      at processQueue (https://code.angularjs.org/1.3.20/angular.js:13318:27)
      at https://code.angularjs.org/1.3.20/angular.js:13334:27
      at Scope.$eval (https://code.angularjs.org/1.3.20/angular.js:14570:28)
      at Scope.$digest (https://code.angularjs.org/1.3.20/angular.js:14386:31)
      at Function.$httpBackend.flush (https://code.angularjs.org/1.3.20/angular-mocks.js:1562:38)
      at Context.<anonymous> (http://fiddle.jshell.net/_display/:77:22)
      at Test.Runnable.run (http://cdnjs.cloudflare.com/ajax/libs/mocha/1.12.1/mocha.js:4150:32)

x "after each" hook:
  Error: [$rootScope:inprog] $digest already in progress
  http://errors.angularjs.org/1.3.20/$rootScope/inprog?p0=%24digest
      at https://code.angularjs.org/1.3.20/angular.js:63:12
      at beginPhase (https://code.angularjs.org/1.3.20/angular.js:14924:15)
      at Scope.$digest (https://code.angularjs.org/1.3.20/angular.js:14366:9)
      at Function.$httpBackend.verifyNoOutstandingExpectation (https://code.angularjs.org/1.3.20/angular-mocks.js:1594:38)
      at Context.<anonymous> (http://fiddle.jshell.net/_display/:69:22)
      at Hook.Runnable.run (http://cdnjs.cloudflare.com/ajax/libs/mocha/1.12.1/mocha.js:4150:32)
      at next (http://cdnjs.cloudflare.com/ajax/libs/mocha/1.12.1/mocha.js:4410:10)
      at http://cdnjs.cloudflare.com/ajax/libs/mocha/1.12.1/mocha.js:4422:5
      at timeslice (http://cdnjs.cloudflare.com/ajax/libs/mocha/1.12.1/mocha.js:5404:27)
```

The second stacktrace is less than helpful and mostly entirely misleading.
This usually happens if you have a unit testing (either mocha or jasmine) setup similar to this:

```js
angular.module('myApp').service('service', function ($http) {
  this.doCall = function(){
    $http.get('http://www.example.com2'); // <-- BUG HERE
  };
});
```

```js
describe('service', function(){
  var service;

  beforeEach(/*... setup and inject everything ...*/);

  afterEach(function(){
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should work', function () {
    $httpBackend.whenGET('http://www.example.com').respond(200);
    service.doCall();
    $httpBackend.flush();
  });
});
```

This setup here is in fact what the [official Angular documentation](https://docs.angularjs.org/api/ngMock/service/$httpBackend)
recommends when using `$httpBackend`, but it doesn't behave very well.

This happens because both [$httpBackend.verifyNoOutstandingExpectation()](https://github.com/angular/angular.js/blob/master/src/ngMock/angular-mocks.js#L1724) and [$httpBackend.flush()](https://github.com/angular/angular.js/blob/master/src/ngMock/angular-mocks.js#L1692) both have `$rootScope.$digest()` in them. When an error happens, the `$digest`
from the `flush()` still hasn't ended by the time the `afterEach` block hits and you get the misleading
`Error: [$rootScope:inprog] $digest already in progress` message.

Here's the `verifyNoOutstandingExpectation()` method:

```js
$httpBackend.verifyNoOutstandingExpectation = function(digest) {
  if (digest !== false) $rootScope.$digest();
  if (expectations.length) {
    throw new Error('Unsatisfied requests: ' + expectations.join(', '));
  }
};
```

<a id="solution"></a>
As we can see, there's an optional undocumented parameter called `digest`. To fix
the issue, call the method with `false` to make it skip the unnecessary `$digest` cycle:

```js
afterEach(function(){
  $httpBackend.verifyNoOutstandingExpectation(false); // <-- no unnecessary $digest
  $httpBackend.verifyNoOutstandingRequest();
});
```

This results in the correct output:

```
x should work
  Error: Unexpected request: GET http://www.example.com2
  No more request expected
      at $httpBackend (https://code.angularjs.org/1.3.20/angular-mocks.js:1263:9)
      at sendReq (https://code.angularjs.org/1.3.20/angular.js:9694:9)
      at serverRequest (https://code.angularjs.org/1.3.20/angular.js:9406:16)
      at processQueue (https://code.angularjs.org/1.3.20/angular.js:13318:27)
      at https://code.angularjs.org/1.3.20/angular.js:13334:27
      at Scope.$eval (https://code.angularjs.org/1.3.20/angular.js:14570:28)
      at Scope.$digest (https://code.angularjs.org/1.3.20/angular.js:14386:31)
      at Function.$httpBackend.flush (https://code.angularjs.org/1.3.20/angular-mocks.js:1562:38)
      at Context.<anonymous> (http://fiddle.jshell.net/_display/:72:22)
      at Test.Runnable.run (http://cdnjs.cloudflare.com/ajax/libs/mocha/1.12.1/mocha.js:4150:32)
```

Here's  a [jsfiddle](https://jsfiddle.net/N4Up7/14/) replicating the issue so
you can play around.
