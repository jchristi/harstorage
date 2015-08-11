### Superposed Tests ###

**Superposed Tests** is powerful feature for aggregation and comparison of test results.

Once the list of labels and time ranges are specified you can observe analysis results.

![http://wiki.harstorage.googlecode.com/hg/images/sp_init.png](http://wiki.harstorage.googlecode.com/hg/images/sp_init.png)

You can also invoke aggregation via "Manage Data" tab on page with test details.

![http://wiki.harstorage.googlecode.com/hg/images/sp_details_menu.png](http://wiki.harstorage.googlecode.com/hg/images/sp_details_menu.png)

### Navigation Analysis ###

The most common example is analysis of changes in perceived performance during user's navigation across multiple pages on a site.

For these purpose you have to create Selenium script and to store results for each step of navigation. **Superposed Tests** will do the rest of job.

![http://wiki.harstorage.googlecode.com/hg/images/sp_navigation.png](http://wiki.harstorage.googlecode.com/hg/images/sp_navigation.png)

### Cross-browser Tests ###

With BrowserMob Proxy you can save pages with the same URL under different names (labels). In that way you can gather metrics for selected page using different browsers and labels with corresponding suffixes.

For instance, the following chart demonstrates the difference in response time of the same page loaded by Internet Explorer 8 and Firefox 7.

![http://wiki.harstorage.googlecode.com/hg/images/sp_cross_browser.png](http://wiki.harstorage.googlecode.com/hg/images/sp_cross_browser.png)

### Page Load Time Dependence on Network Quality ###

Similarly you can split results for various sets of connection speed and network latency (BrowserMob Proxy provides such features as well).

Chart below shows page load time degradation over network latency value.

![http://wiki.harstorage.googlecode.com/hg/images/sp_latency.png](http://wiki.harstorage.googlecode.com/hg/images/sp_latency.png)

### Performance of 3rd Party Content ###

Finally you can test you pages with blacklisted third party content (yep, BrowserMob Proxy can do even this) and compare these metrics with general results.

This chart is an example of comparative analysis and indicates that with 3rd party components tested page is about 14% slower.

![http://wiki.harstorage.googlecode.com/hg/images/sp_3rd_party.png](http://wiki.harstorage.googlecode.com/hg/images/sp_3rd_party.png)

### Histograms ###

There is "Histogram" feature at "Manage Data" tab on page with test details.

![http://wiki.harstorage.googlecode.com/hg/images/sp_histogram.png](http://wiki.harstorage.googlecode.com/hg/images/sp_histogram.png)

Thus you can plot timing histogram for particular Label (Page ID).