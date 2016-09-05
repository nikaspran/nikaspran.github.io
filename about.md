---
layout: page
title:
permalink: /about/
class: about
---

### Social

<ul class="social">
	<li class="blog">
		<h4 class="fa fa-globe"></h4>
		<a href="http://nikas.praninskas.com">http://nikas.praninskas.com</a>
	</li>
	<li class="email">
		<h4 class="fa fa-envelope"></h4>
		<a href="mailto:nikaspran@gmail.com">nikaspran@gmail.com</a>
	</li>
	<li class="twitter">
		<h4 class="fa fa-twitter"></h4>
		<a href="https://twitter.com/nikaspran">@nikaspran</a>
	</li>
	<li class="github">
		<h4 class="fa fa-github"></h4>
		<a href="https://github.com/nikaspran">github/nikaspran</a>
	</li>
	<li class="linkedin">
		<h4 class="fa fa-linkedin"></h4>
		<a href="https://lt.linkedin.com/pub/nikas-praninskas/50/543/48b">http://lnkdin.me/nikaspran</a>
	</li>
</ul>

### Work

<ul class="timeline">
	<li data-duration="Ongoing" class="wrap ongoing">
		<span class="start" data-end="Now">2015-10</span>
		<h4>Wrap Media - Front End Developer</h4>
		<p>Angular, CoffeeScript, Gulp, HTML, CSS, Less</p>
		<p></p>
	</li>
	<li data-duration="1 year & 9 months" class="wix">
		<span class="start" data-end="2015-10">2014-02</span>
		<h4>Wix - Front End Developer</h4>
		<p>Angular, JavaScript, Gulp, Grunt, HTML, CSS, SASS</p>
		<p>Part of the <a href="http://www.wix.com/app-market/">App Market</a>
		team. Initiator of migration to <a href="https://github.com/wix/wix-gulpfile">Gulp</a>.
		</p>
	</li>
	<li data-duration="5 months" class="barclays">
		<span class="start" data-end="2014-02">2013-10</span>
		<h4>Barclays - Gateway Developer</h4>
		<p>Java, Spring, Hibernate</p>
		<p>Mostly backend Enterprise Java</p>
	</li>
	<li data-duration="1 year & 9 months" class="insoft">
		<span class="start" data-end="2013-09">2012-01</span>
		<h4>Insoft - Java Developer</h4>
		<p>Java, Spring, Hibernate, Oracle DB, SQL, ZK</p>
		<p>Full-stack EE Java. Mostly long-term government contracts (i.e. central
		e-government gateway for Lithuania, hiring system for government employees)</p>
	</li>
</ul>

### Side projects

* [bookhunter.co](http://www.bookhunter.co) - price comparison for Goodreads wishlists.
<br/> React, Redux, Node, ES6+.

### Talks

{% for talk in site.posts %}
	{% if talk.layout == "talk" %}
* [{{ talk.summary }}]({{talk.url}}), given at {{ talk.location }}
	{% endif %}
{% endfor %}

### Education

* BS, Software Engineering. Vilnius University, 2009-2013.
