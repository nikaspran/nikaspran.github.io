---
layout:     post
title:      "Talk: Web Components"
date:       2015-01-20 18:00:00
summary:		"Web Components: The (near) Future of Web Development"
categories: web
tags:       web components, javascript, custom elements, html imports, shadow dom, templates, talk
---

### Live version

Currently only viewable in Chrome, press F for [fullscreen](/talk-web-components/)

<style>
.hidden {display: none}
</style>

<iframe src="/talk-web-components/" class="hidden"
				frameborder="0" allowfullscreen
				style="width: 100%; height: 500px">
</iframe>

<script>
var supportsTemplate = 'content' in document.createElement('template'),
		supportsCustomElements = 'registerElement' in document,
		supportsHtmlImports = 'import' in document.createElement('link'),
		supportsShadowDom = 'createShadowRoot' in document.body;
if (supportsTemplate && supportsCustomElements && supportsHtmlImports && supportsShadowDom) {
	document.querySelector('.hidden').className = '';
}
</script>

<a href="http://github.com/nikaspran/talk-web-components" target="_blank">Source</a>

### Offline version

<script async class="speakerdeck-embed" data-id="a7466f5082520132d5404ee58d225789" data-ratio="1.6" src="//speakerdeck.com/assets/embed.js"></script>
