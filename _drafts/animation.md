---
layout:     post
title:      Backwards compatible animation
date:       2015-04-26
summary:
categories: web
tags:       animation, css, svg
---
###
Various technologies for animating stuff:
* CSS3 animations
	* Raw DOM elements - works well everywhere, difficult to draw stuff
	* SVG - easy to draw, massive compatibility problems
		* IE11 doesn't work at all
		* Firefox works differently from Chrome
		* Chrome rendering bugs
* JS animations
	* Raw DOM - works well
	* SVG - if used via CSS property manipulation, similar problems to CSS3
	* SVG - if modifying raw attributes (points etc.) then difficult to use
* Canvas
	* Not inspectable, looks somewhat iffy in some cases
	* Need to use framework or it's a bit of a nightmare
* Frameworks
	* Snapsvg - dead?
	* Velocity/GSAP - should be fine, see above regarding JS animations
	* D3 - too low level?
* HTML5 video
	* Video format support?
	* Need to record animation somehow
* GIFs
	* How do you pause it?
	* Heavyweight?
	* Difficult to create an endless animation
