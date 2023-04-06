---
layout:     post
title:      "Efficient Data Formats for GPT"
date:       2023-04-05
summary:		"Some data formats take up more tokens and are more expensive to use with LLM models like ChatGPT"
categories: ai
tags:       [chatgpt, openai, gpt, ai, llm]
comments:   true
---

**TL;DR:** Try YAML/TOML or CSV instead of JSON with GPT models. Read the [Conclusion](#conclusion) for a bit more detail.

## Methodology

Large Language Models (LLMs) like GPT use *tokens* to process and generate text. Tokens are essentially common sequences of text.

Some data formats intrinsically take up more tokens and are more expensive to use with LLM models like ChatGPT.
For example, at [$0.02+ per 1000 tokens](https://openai.com/pricing) for OpenAI GPT models, each additional token has a very direct cost associated. Current LLMs are also constrained by their available memory, which is usually measured in tokens. Thus, having a more efficient data serialization format is cheaper and allows us to use memory more efficiently.

This post looks at a few popular data formats and compares their cost in tokens.

All comparisons use the same data in different formats. The data used is as follows, taken from [json.org](https://json.org/example.html) and generated using ChatGPT:

`servlets`:

```json
{
  "web-app": {
    "servlet": [
      {
        "servlet-name": "cofaxCDS",
        "servlet-class": "org.cofax.cds.CDSServlet",
        "init-param": {
          "configGlossary:installationAt": "Philadelphia, PA",
          "configGlossary:adminEmail": "ksm@pobox.com",
          "configGlossary:poweredBy": "Cofax",
          "configGlossary:poweredByIcon": "/images/cofax.gif",
          "configGlossary:staticPath": "/content/static",
          "templateProcessorClass": "org.cofax.WysiwygTemplate",
          "templateLoaderClass": "org.cofax.FilesTemplateLoader",
          "templatePath": "templates",
          "templateOverridePath": "",
          "defaultListTemplate": "listTemplate.htm",
          "defaultFileTemplate": "articleTemplate.htm",
          "useJSP": false,
          "jspListTemplate": "listTemplate.jsp",
          "jspFileTemplate": "articleTemplate.jsp",
          "cachePackageTagsTrack": 200,
          "cachePackageTagsStore": 200,
          "cachePackageTagsRefresh": 60,
          "cacheTemplatesTrack": 100,
          "cacheTemplatesStore": 50,
          "cacheTemplatesRefresh": 15,
          "cachePagesTrack": 200,
          "cachePagesStore": 100,
          "cachePagesRefresh": 10,
          "cachePagesDirtyRead": 10,
          "searchEngineListTemplate": "forSearchEnginesList.htm",
          "searchEngineFileTemplate": "forSearchEngines.htm",
          "searchEngineRobotsDb": "WEB-INF/robots.db",
          "useDataStore": true,
          "dataStoreClass": "org.cofax.SqlDataStore",
          "redirectionClass": "org.cofax.SqlRedirection",
          "dataStoreName": "cofax",
          "dataStoreDriver": "com.microsoft.jdbc.sqlserver.SQLServerDriver",
          "dataStoreUrl": "jdbc:microsoft:sqlserver://LOCALHOST:1433;DatabaseName=goon",
          "dataStoreUser": "sa",
          "dataStorePassword": "dataStoreTestQuery",
          "dataStoreTestQuery": "SET NOCOUNT ON;select test='test';",
          "dataStoreLogFile": "/usr/local/tomcat/logs/datastore.log",
          "dataStoreInitConns": 10,
          "dataStoreMaxConns": 100,
          "dataStoreConnUsageLimit": 100,
          "dataStoreLogLevel": "debug",
          "maxUrlLength": 500
        }
      },
      {
        "servlet-name": "cofaxEmail",
        "servlet-class": "org.cofax.cds.EmailServlet",
        "init-param": {
          "mailHost": "mail1",
          "mailHostOverride": "mail2"
        }
      },
      {
        "servlet-name": "cofaxAdmin",
        "servlet-class": "org.cofax.cds.AdminServlet"
      },
      {
        "servlet-name": "fileServlet",
        "servlet-class": "org.cofax.cds.FileServlet"
      },
      {
        "servlet-name": "cofaxTools",
        "servlet-class": "org.cofax.cms.CofaxToolsServlet",
        "init-param": {
          "templatePath": "toolstemplates/",
          "log": 1,
          "logLocation": "/usr/local/tomcat/logs/CofaxTools.log",
          "logMaxSize": "",
          "dataLog": 1,
          "dataLogLocation": "/usr/local/tomcat/logs/dataLog.log",
          "dataLogMaxSize": "",
          "removePageCache": "/content/admin/remove?cache=pages&id=",
          "removeTemplateCache": "/content/admin/remove?cache=templates&id=",
          "fileTransferFolder": "/usr/local/tomcat/webapps/content/fileTransferFolder",
          "lookInContext": 1,
          "adminGroupID": 4,
          "betaServer": true
        }
      }
    ],
    "servlet-mapping": {
      "cofaxCDS": "/",
      "cofaxEmail": "/cofaxutil/aemail/*",
      "cofaxAdmin": "/admin/*",
      "fileServlet": "/static/*",
      "cofaxTools": "/tools/*"
    },
    "taglib": {
      "taglib-uri": "cofax.tld",
      "taglib-location": "/WEB-INF/tlds/cofax.tld"
    }
  }
}
```

`flat`:

```json
[
  {
    "name": "John Doe",
    "occupation": "Software Developer",
    "age": 30
  },
  {
    "name": "Jane Smith",
    "occupation": "Teacher",
    "age": 40
  },
  {
    "name": "Michael Johnson",
    "occupation": "Accountant",
    "age": 45
  },
  {
    "name": "Samantha Lee",
    "occupation": "Graphic Designer",
    "age": 28
  },
  {
    "name": "Robert Williams",
    "occupation": "Marketing Manager",
    "age": 50
  },
  {
    "name": "Emily Davis",
    "occupation": "Journalist",
    "age": 35
  },
  {
    "name": "William Brown",
    "occupation": "Engineer",
    "age": 42
  },
  {
    "name": "Amanda Wilson",
    "occupation": "Sales Manager",
    "age": 37
  },
  {
    "name": "Daniel Martin",
    "occupation": "Doctor",
    "age": 55
  },
  {
    "name": "Megan Anderson",
    "occupation": "Web Developer",
    "age": 29
  },
  {
    "name": "Christopher Garcia",
    "occupation": "Architect",
    "age": 48
  },
  {
    "name": "Stephanie Rodriguez",
    "occupation": "Human Resources Manager",
    "age": 39
  },
  {
    "name": "David Hernandez",
    "occupation": "Real Estate Agent",
    "age": 44
  },
  {
    "name": "Ashley Perez",
    "occupation": "Graphic Designer",
    "age": 27
  },
  {
    "name": "Erica Turner",
    "occupation": "Financial Analyst",
    "age": 33
  },
  {
    "name": "James Cooper",
    "occupation": "Project Manager",
    "age": 41
  },
  {
    "name": "Michelle Taylor",
    "occupation": "Public Relations Specialist",
    "age": 36
  },
  {
    "name": "Steven Parker",
    "occupation": "Lawyer",
    "age": 52
  },
  {
    "name": "Lauren Hall",
    "occupation": "Product Manager",
    "age": 31
  },
  {
    "name": "Brandon Wright",
    "occupation": "IT Manager",
    "age": 47
  }
]
```

`DOM-like`:

```json
{
  "title": "My Website",
  "header": {
    "logo": "logo.png",
    "navigation": [
      { "text": "Home", "link": "index.html" },
      { "text": "About", "link": "about.html" },
      { "text": "Contact", "link": "contact.html" }
    ]
  },
  "main": {
    "sections": [
      {
        "title": "Welcome to my website!",
        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod euismod est, eu fringilla sapien facilisis id. Proin bibendum vestibulum tortor vel aliquam. Integer ultrices justo vitae nisl dapibus sagittis. Sed vitae velit justo."
      },
      {
        "title": "About me",
        "content": "Curabitur vel ullamcorper nibh. In eget nisl vel ante pulvinar aliquet. Suspendisse vel pharetra purus, eu tincidunt libero. Duis ac sagittis dolor. Nulla facilisi. Nam at ex vitae tellus suscipit congue id id libero. Aliquam lobortis lorem non sapien maximus, vitae bibendum ipsum vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
      },
      {
        "title": "Contact me",
        "content": "Curabitur vel ullamcorper nibh. In eget nisl vel ante pulvinar aliquet. Suspendisse vel pharetra purus, eu tincidunt libero. Duis ac sagittis dolor. Nulla facilisi. Nam at ex vitae tellus suscipit congue id id libero. Aliquam lobortis lorem non sapien maximus, vitae bibendum ipsum vehicula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas."
      }
    ]
  },
  "footer": {
    "copyright": {
      "text": "© 2023 My Website",
      "link": "index.html"
    },
    "social": [
      { "icon": "facebook.png", "link": "#" },
      { "icon": "twitter.png", "link": "#" },
      { "icon": "instagram.png", "link": "#" }
    ]
  }
}
```

Token counts are calculated using:
- GPT: [https://platform.openai.com/tokenizer](https://platform.openai.com/tokenizer)

## Results

| Format        | Dataset  | Characters | GPT  |
| ------------- | -------- | ---------- | ---- |
| XML           | DOM-like | 2081       | 887  |
| JSON          | DOM-like | 1780       | 745  |
| YAML          | DOM-like | 1576       | 616  |
| TOML          | DOM-like | 1642       | 593  |
| CSV           | DOM-like | 1682       | 598  |
| JSON minified | DOM-like | 1514       | 491  |
| XML           | flat     | 2238       | 931  |
| JSON          | flat     | 1760       | 757  |
| YAML          | flat     | 1222       | 341  |
| TOML          | flat     | 1457       | 493  |
| CSV           | flat     | 658        | 181  |
| JSON minified | flat     | 1279       | 317  |
| XML           | servlets | 5019       | 2286 |
| JSON          | servlets | 3718       | 1820 |
| YAML          | servlets | 2964       | 1213 |
| TOML          | servlets | 2968       | 1086 |
| CSV           | servlets | 2900       | 950  |
| JSON minified | servlets | 2710       | 835  |

<div style="font-size: .5em; margin-top: 2em;">
  * Potentially lossy and difficult to generate
</div>

<div style="display: flex; justify-content: center; margin-top: 2em;">
  <!-- <iframe class="google-chart" width="600" height="371" seamless frameborder="0" scrolling="no" src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSw5EL3u7SGKM0Csj13nJhYMbQ1tw93rMK3mcKasxRyG5AliYaZybU-23miCYIMoPSDMpXnoKV-81SX/pubchart?oid=60533594&amp;format=interactive"></iframe> -->

  <img src="https://docs.google.com/spreadsheets/d/e/2PACX-1vSw5EL3u7SGKM0Csj13nJhYMbQ1tw93rMK3mcKasxRyG5AliYaZybU-23miCYIMoPSDMpXnoKV-81SX/pubchart?oid=60533594&amp;format=image" width="100%" height="auto">
</div>

## Conclusion

Depending on your dataset and what you're trying to generate, it might be a great idea to try an alternative data serialization format.

In particular, these formats seem to be worth experimenting with:
- **YAML** or **TOML**. For nested and recursive datasets, YAML and TOML seem to be somewhere between 25 and 50 percent more efficient than the equivalent data in JSON, and in general more efficient accross the board. I would probably pick this as a good starting point as these formats are highly available in most programming languages and seem to have a good efficiency token-wise.
- **CSV**. For highly uniform flat data (i.e. flat lists of things), data formatted in CSV can be up to 5 times as efficient as the same data formatted as JSON. However, it can also be *very inefficient and lossy* for deeply nested or recursive data. In particular, for this kind of nested data the accuracy of LLM generation would probably be a significant issue.

Finally, given how much of a difference data serialization format seems to have in regards to the token count, further research should be conducted in this area. I'd wager it won't be long until we see a new LLM-focused data serialization format, perhaps one that is highly efficient token-wise.

It might also be interesting to compare different data formats by how they impact LLM accuracy & generative capabilities, but that is left as an exercise to the reader.
