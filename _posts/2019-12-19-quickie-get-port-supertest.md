---
layout:     post
title:      "Quickie: get host of SuperTest instance"
date:       2019-12-19
summary:		"An easy way to use nock.enableNetConnect() just for your SuperTest instance"
categories: javascript
tags:       [express, javascript, testing, supertest, nock]
comments:   true
---

Have you ever needed to get the port and hostname of a [SuperTest](https://www.npmjs.com/package/supertest) instance? For example, this can be useful if you're trying to also use `nock.disableNetConnect()` in your tests to prevent external requests.

Normally, when creating SuperTest by just passing it the express app, it uses an ephemeral port that you do not know in advance.
This means that if you call something like `nock.disableNetConnect()` and use SuperTest, it will throw an error that's something like this:

```
NetConnectNotAllowedError: Nock: Not allow net connect for "127.0.0.1:35037/your_path"
```

As a workaround, you _can_ create the http server yourself and pass it to SuperTest, but I've recently found a decent way to get the full host (hostname and port) from a SuperTest instance without doing that.

In short, you can do a fake "request" which then allows you to retrieve the actual host.

```js
const request = superTest(app); // your express app
const superTestHostname = request.get('').url; // http://127.0.0.1:35037
```

Here's how it could look when used with nock:

```js
const nock = require('nock');
const url = require('url');
const express = require('express');
const superTest = require('supertest');

const app = express();
// ... your app

const request = superTest(app);

function disableOutsideConnections() {
  const superTestHostname = request.get('').url;
  const { host: superTestHost } = url.parse(superTestHostname);
  nock.disableNetConnect();
  nock.enableNetConnect(superTestHost);
}

beforeAll(disableOutsideConnections);
```

Here's a working example on [RunKit](https://runkit.com/nikaspran/5dfb4886cbf8160019faf9c3) so you can play around.
