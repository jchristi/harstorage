### Introduction ###

The primary use case is integration with [Selenium](http://code.google.com/p/selenium/) and [BrowserMob Proxy](https://github.com/webmetrics/browsermob-proxy). Top level infrastructure looks like this:

![http://wiki.harstorage.googlecode.com/hg/images/infra.png](http://wiki.harstorage.googlecode.com/hg/images/infra.png)

Alternatively, you can use HTTP sniffers like [HttpWatch](http://www.httpwatch.com/), [Fiddler](http://www.fiddler2.com/fiddler2/) or [Charles](http://www.charlesproxy.com/).

There are tutorials for:
  * BrowserMob Proxy ([Python](http://code.google.com/p/harstorage/wiki/PythonTutorial#Proxy), [Java](http://code.google.com/p/harstorage/wiki/JavaTutorial#Proxy))
  * HttpWatch Professional Edition ([Python](http://code.google.com/p/harstorage/wiki/PythonTutorial#Professional_Edition))

### How to Upload ###
Uploading is implemented via POST request
```
POST http://localhost:5000/results/upload```

Optional HTTP Header:
```

Automated: true```

Request body:
```
file=har```

Where _har_ is JSON-like content of captured HAR file.

If you are using Python your code may look like:
```
import httplib, urllib

headers = {"Content-type": "application/x-www-form-urlencoded", "Automated": "true"}

body = urllib.urlencode({"file": har})

connection = httplib.HTTPConnection("localhost", "5000")

connection.request("POST", "/results/upload", body, headers)

connection.close()```

"Successful" is returned in case of successful upload, exception message is returned otherwise.

### Labels ###

Principal aggregation is based on custom labels (page IDs). You can set them in HAR file:

```

"pages":[{
"startedDateTime":"2011-07-13T13:51:21.443+03:00",
"id":"homePage",
"title":"Home Page",
"pageTimings":{
"_renderStart":773,
"onLoad":1960
}
}],
…
"entries":[{
"pageref":"homePage",
"startedDateTime":"2011-07-13T13:51:21.443+03:00",
"time":109,
…
}]```

That's absolutely native action when you use BrowserMob Proxy. Additionally you can use label prefixes (for instance, 10M`_`,1M`_`,IE8`_`,FF4`_`) to separate results of different tests.

### Custom Time Metrics ###

You can specify custom page load time via **`_`myTime** object. This metric has the highest priority.

```

"pages":[{
"startedDateTime":"2011-07-13T13:51:21.443+03:00",
"id":"page_54140",
"title":"Google",
"pageTimings":{
"onContentLoad":173,
"onLoad":1960,
"_myTime":3410,
}
}]```

### Summary Stats ###

| **Metric** | **Description** |
|:-----------|:----------------|
| Full Load Time | The difference between the time of "last byte" and value of startedDateTime object (date and time stamp for the beginning of the page load).<br />Can be overwritten by custom metric "`_`myTime" (see HAR fragment above).|
| onLoad Event | JavaScript onLoad event for the document. |
| Start Render Time | The  time when something non-white is first displayed in the browser window. |
| Time to First Byte |  The time from when the first HTTP request sent until the response starts coming in for the base page (including the DNS time, socket connect and request time). It does not include time spent on redirects. |
| Total DNS Time | The total time of DNS lookups. |
| Total Transfer Time | The total time spent on sending and receiving data over network. |
| Total Server Time | The total time spent on server while processing user requests. |
| AVG Connecting Time | Average time spent to establish the network connections. |
| AVG Blocking Time | Average wait time due to limitations of browser or system resources. |
| Total Size | The total size of all resources. |
| Text Files | The total size of all HTML, XML, JSON, JavaScript and CSS resources. |
| Media Files | The total size of image anf flash files. |
| Cache Size | The total size of resources with explicit cache headers. |
| Requests   | The total number of network requests. |
| Redirects  | The total number of requests to the server that responded with an HTTP status code of 3xx. |
| Bad Requests | The total number of requests to the server that responded with an HTTP status code of 4xx or 5xx. |
| Domains    | The number of domains that host the web sites resources. |

### Page Speed Integration ###
Page Speed evaluates the page's conformance to a number of different rules. These rules are general front-end best practices you can apply at any stage of web development.

See [Web Performance Best Practices](http://code.google.com/speed/page-speed/docs/rules_intro.html) for details.

### Aggregation and Comparison ###

Aggregation and comparison of test results are described [here](http://code.google.com/p/harstorage/wiki/SuperposedTests) in details.

### HAR Viewer ###

[HAR Viewer](http://www.softwareishard.com/blog/har-viewer/) (HTTP Archive Viewer) is an online tool visualizing HTTP Archive (HAR) files produced by HTTP tracking tools developed by Jan Odvarko.