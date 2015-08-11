## BrowserMob Proxy ##

HTTP handler:
```

package org.paulau.harstorage.tutorial;

import java.io.*;
import java.net.*;

public class HttpRequest {
public String host;
public String port;
public String path;
public String method;

private String response;

public void setRequestHostname(String host) {
this.host = host;
}

public void setRequestPort(String port) {
this.port = port;
}

public void setRequestPath(String path) {
this.path = path;
}

public void setRequestMethod(String method) {
this.method = method;
}

public String send() throws Exception {
// Connection
URL url = new URL("http://" + host + ":" + port + path);

HttpURLConnection connection = (HttpURLConnection) url.openConnection();

connection.setRequestMethod(method);

// Get the response
BufferedReader rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
String line;
response = "";
while ((line = rd.readLine()) != null) {
response += line;
}

rd.close();

connection.disconnect();

return response;
}

public String send(String data) throws Exception {
// Connection
URL url = new URL("http://" + host + ":" + port + path);

HttpURLConnection connection = (HttpURLConnection) url.openConnection();

connection.setRequestMethod(method);

connection.setDoOutput(true);

// HTTP headers
connection.setRequestProperty("Automated", "true");

// Send data to server
OutputStreamWriter wr = new OutputStreamWriter(connection.getOutputStream());

data = URLEncoder.encode(data, "utf-8");

wr.write("file=" + data);
wr.flush();
wr.close();

// Get the response
BufferedReader rd = new BufferedReader(new InputStreamReader(connection.getInputStream()));
String line;
response = "";
while ((line = rd.readLine()) != null) {
response += line;
}

rd.close();

connection.disconnect();

return response;
}
}
```

Browsermob Proxy:
```

package org.paulau.harstorage.tutorial;

public class BrowsermobProxy {
private HttpRequest httpRequest;
private String baseURL;
private String response;

BrowsermobProxy(String apiHostName, String apiPort) {
httpRequest = new HttpRequest();
httpRequest.setRequestHostname(apiHostName);
httpRequest.setRequestPort(apiPort);
}

public void init(String proxyPort) {
// Base URL for API requests
baseURL = "/proxy/" + proxyPort;

// Proxy initialization via REST API
httpRequest.setRequestMethod("POST");
httpRequest.setRequestPath("/proxy?port=" + proxyPort);

try {
httpRequest.send();
} catch(Exception e) {
e.printStackTrace();
}
}

public void createHar(String pageId) {
httpRequest.setRequestMethod("PUT");

String path = baseURL;
path += "/har";
path += "?initialPageRef=" + pageId;
path += "&captureHeaders=true";
path += "&captureContent=true";

httpRequest.setRequestPath(path);

try {
httpRequest.send();
} catch(Exception e) {
e.printStackTrace();
}
}

public String fetchHar() {
httpRequest.setRequestMethod("PUT");

String path = baseURL;

path += "/har";

httpRequest.setRequestPath(path);

try {
response = httpRequest.send();
} catch(Exception e) {
e.printStackTrace();
}

return response;
}

public void limitNetwork(String bw_down, String bw_up, String latency) {
httpRequest.setRequestMethod("PUT");

String path = baseURL;
path += "/limit";
path += "?upstreamKbps=" + bw_up;
path += "&downstreamKbps=" + bw_down;
path += "&latency=" + latency;

httpRequest.setRequestPath(path);

try {
httpRequest.send();
} catch(Exception e) {
e.printStackTrace();
}
}

public void addToBlackList(String regEx) {
httpRequest.setRequestMethod("PUT");

String path = baseURL;

path += "/blacklist";
path += "?status=-200";
path += "&regex=" + regEx;

httpRequest.setRequestPath(path);

try {
httpRequest.send();
} catch(Exception e) {
e.printStackTrace();
}
}

public void terminate() {
httpRequest.setRequestMethod("DELETE");

httpRequest.setRequestPath(baseURL);

try {
httpRequest.send();
} catch(Exception e) {
e.printStackTrace();
}
}
}
```

HAR Storage:
```

package org.paulau.harstorage.tutorial;

public class HarStorage {
private HttpRequest httpRequest;

HarStorage(String host, String port) {
httpRequest = new HttpRequest();
httpRequest.setRequestHostname(host);
httpRequest.setRequestPort(port);
}

public String save(String har) throws Exception {
httpRequest.setRequestMethod("POST");
httpRequest.setRequestPath("/results/upload");

return httpRequest.send(har);
}
}
```

Main class:
```

package org.paulau.harstorage.tutorial;

import org.openqa.selenium.*;
import org.openqa.selenium.firefox.*;
import org.openqa.selenium.remote.*;

public class Main {

// BrowserMob Proxy API
private static final String PROXY_API_HOST = "localhost";
private static final String PROXY_API_PORT = "8080";

// Temporary proxy for browser you create via BrowserMob Proxy.
// PROXY_HOST must be equal to PROXY_API_HOST
private static final String PROXY_HOST = PROXY_API_HOST;
private static final String PROXY_PORT = "9090";

// Network configuration
private static final String DOWNSTREAM_KBPS = "1024";
private static final String UPSTREAM_KBPS = "512";
private static final String LATENCY_MS = "100";

// HAR Storage
private static final String HARSTORAGE_HOST = "localhost";
private static final String HARSTORAGE_PORT = "5000";

public static void main(String[] args) {

// BrowserMob Proxy constructor
BrowsermobProxy bmp = new BrowsermobProxy(PROXY_API_HOST, PROXY_API_PORT);

// Temporary proxy initialization
bmp.init(PROXY_PORT);

// Change browser settings
Proxy proxy = new Proxy();

String PROXY = PROXY_HOST + ":" + PROXY_PORT;

proxy.setHttpProxy(PROXY);
proxy.setSslProxy(PROXY);

DesiredCapabilities capabilities = new DesiredCapabilities();
capabilities.setCapability(CapabilityType.PROXY, proxy);

WebDriver driver = new FirefoxDriver(capabilities);

// Network emulation
bmp.limitNetwork(DOWNSTREAM_KBPS, UPSTREAM_KBPS, LATENCY_MS);

// Create new HAR container
bmp.createHar("Home_Page");

// Navigate to target webpage
try {
driver.navigate().to("http://www.google.com");

Thread.sleep(2000);

driver.quit();
} catch (Exception e) {
e.printStackTrace();
}

// Read data from container
String har = bmp.fetchHar();

// Send results to HAR Storage
try {
HarStorage hs = new HarStorage(HARSTORAGE_HOST, HARSTORAGE_PORT);

String response = hs.save(har);
System.out.println(response);
} catch (Exception e) {
e.printStackTrace();
}

// Close the browser
driver.quit();

// Terminate temporary proxy
bmp.terminate();
}
}
```