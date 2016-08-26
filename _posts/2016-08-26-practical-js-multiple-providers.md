---
layout:     post
title:      "Practical JS: Multiple Providers"
date:       2016-08-26
summary:    "A polymorphic way to consume multiple providers"
categories: javascript
comments:   true
tags:       [practical js, javascript, node]
---

Sometimes, you have multiple providers for the same functionality. For example,
while working on my [book recommendation website](http://www.bookhunter.co/),
I had to fetch listings for books from various different vendors (Amazon, BookDepository and such).

The initial solution was to just use imports and then put them into an array:

```js
import amazonUs from './vendors/amazonUs';
import amazonUk from './vendors/amazonUk';
import amazonCa from './vendors/amazonCa';
import amazonDe from './vendors/amazonDe';
import amazonEs from './vendors/amazonEs';
import amazonFr from './vendors/amazonFr';
import abeBooks from './vendors/abeBooks';
import bookDepository from './vendors/bookDepository';

const vendors = [
  amazonUs,
  amazonUk,
  amazonCa,
  amazonDe,
  amazonEs,
  amazonFr,
  abeBooks,
  bookDepository
];

export default function fetchListings(book) {
  return Promise.all(vendors.map(vendor => vendor.fetchListing(book)));
}
```

As you can imagine, this gets pretty cumbersome when you have to support more
more than a few vendors (Amazon alone has 12 locales which need to be handled separately).
In order to add a new vendor, you have to create a new file, then import that file here and
also add it to the array.

However, if you're using Node or a CommonJS-enabled environment, you can do something like this:

```js
import fs from 'fs';

const vendors = fs.readdirSync(`${__dirname}/vendors`)
  .map(vendor => require(`${__dirname}/vendors/${vendor}`).default);

export default function fetchListings(book) {
  return Promise.all(vendors.map(vendor => vendor.fetchListing(book)));
}
```

To add a new vendor, all you have to do is create the file. It's not much, but it
helps streamline the process.

As a final note, if you're doing this often, you could write a small helper function:

```js
import fs from 'fs';

export function requireAllFrom(dirName) {
  return fs.readdirSync(dirName).map(file => require(`${dirName}/${file}`));
}
```

Elsewhere:

```js
const vendors = requireAllFrom(`${__dirname}/vendors`)
  .map(v => v.default);
```

I've also used this for:

* Creating unit tests that use fixtures and expected file output
* Adding custom plugins to Babel
* Creating multiple loggers for analytics (i.e. console and Mixpanel)
