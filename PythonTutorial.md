## BrowserMob Proxy ##

Imports and settings
```

from selenium import webdriver
from urllib import urlencode
import httplib
import time

#BrowserMob Proxy API
PROXY_API_HOST = "localhost"
PROXY_API_PORT = "8080"

#Temporary proxy for browser you create via BrowserMob Proxy.
#PROXY_HOST must be equal to PROXY_API_HOST
PROXY_HOST = PROXY_API_HOST
PROXY_PORT = "9090"

#Network configuration
DOWNSTREAM_KBPS = "1024"
UPSTREAM_KBPS = "512"
LATENCY_MS = "100"

#HAR Storage
HARSTORAGE_HOST = "localhost"
HARSTORAGE_PORT = "5000"
```

HTTP handler:
```

class HttpRequest():

def __init__(self, hostname, port):
self.hostname = hostname
self.port = port

def send(self, method, path, body=None, headers=None):
connection = httplib.HTTPConnection(self.hostname, self.port)

if body is not None and headers is not None:
connection.request(method, path, body, headers)
else:
connection.request(method, path)

response = connection.getresponse().read()

connection.close()

return response
```

Browsermob Proxy:
```

class BrowserMobProxy():

def __init__(self, proxy_api_host, proxy_api_port):
self.http_request = HttpRequest(proxy_api_host, proxy_api_port)

def create_proxy(self, proxy_port):
# Base URL for API requests
self.base_url = "/proxy/" + proxy_port

# Proxy initialization via REST API
path = "/proxy?port=" + proxy_port

self.http_request.send("POST", path)

def create_har(self, page_id):
parameters = {"initialPageRef": page_id, "captureHeaders": "true", "captureContent": "true"}

path = self.base_url + "/har?" + urlencode(parameters)

self.http_request.send("PUT", path)

def fetch_har(self):
path = self.base_url + "/har"

return self.http_request.send("GET", path)

def limit_network(self, bw_down, bw_up, latency):
parameters = {"upstreamKbps": bw_up, "downstreamKbps": bw_down, "latency": latency}

path = self.base_url + "/limit?" + urlencode(parameters)

self.http_request.send("PUT", path)

def terminate(self):
path = self.base_url

self.http_request.send("DELETE", path)
```

HAR Storage:
```

class HarStorage():

def __init__(self, host, port):
self.http_request = HttpRequest(host, port)

def save(self, har):
path = "/results/upload"

headers = {"Content-type": "application/x-www-form-urlencoded", "Automated": "true"}

body = urlencode({"file": har})

return self.http_request.send("POST", path, body, headers)
```

Browser:
```

class Firefox():

def __init__(self):
self.profile = webdriver.FirefoxProfile()

def set_proxy(self, proxy_host, proxy_port):
self.profile.set_preference("network.proxy.http", proxy_host)
self.profile.set_preference("network.proxy.http_port", int(proxy_port))
self.profile.set_preference("network.proxy.type", 1)
self.profile.update_preferences()

def launch(self):
self.driver = webdriver.Firefox(firefox_profile = self.profile)
```

Top-level script
```

if __name__ == "__main__":
# BrowserMob Proxy constructor
bmp = BrowserMobProxy(PROXY_API_HOST, PROXY_API_PORT)

# Temporary proxy initialization
bmp.create_proxy(PROXY_PORT)

# Change browser settings
firefox = Firefox()
firefox.set_proxy(PROXY_HOST, PROXY_PORT)
firefox.launch()

# Network emulation
bmp.limit_network(DOWNSTREAM_KBPS, UPSTREAM_KBPS, LATENCY_MS)

# Create new HAR container
bmp.create_har("Home_Page")

# Navigate to target webpage
firefox.driver.get("http://www.google.com/")
time.sleep(2)

# Read data from container
har = bmp.fetch_har()

# Send results to HAR Storage
harstorage = HarStorage(HARSTORAGE_HOST, HARSTORAGE_PORT)
print harstorage.save(har)

# Close the browser
firefox.driver.quit()

# Terminate proxy
bmp.terminate()
```


## HttpWatch Professional Edition ##

Imports and settings
```

from selenium import webdriver
from urllib import urlencode
import httplib
import time

#HAR Storage
HARSTORAGE_HOST = "localhost"
HARSTORAGE_PORT = "5000"
```

HTTP handler:
```

class HttpRequest():

def __init__(self, hostname, port):
self.hostname = hostname
self.port = port

def send(self, method, path, body, headers):
connection = httplib.HTTPConnection(self.hostname, self.port)

connection.request(method, path, body, headers)

response = connection.getresponse().read()

connection.close()

return response
```

HAR Storage:
```

class HarStorage():

def __init__(self, host, port):
self.http_request = HttpRequest(host, port)

def save(self, har):
path = "/results/upload"

headers = {"Content-type": "application/x-www-form-urlencoded", "Automated": "true"}

body = urlencode({"file": har})

return self.http_request.send("POST", path, body, headers)
```

Top-level script
```

if __name__ == "__main__":
#Initialize HttpWatch plugin
controller = win32com.client.Dispatch("HttpWatch.Controller")

# Start new browser instance
plugin = controller.IE.New()

# Start recorder
plugin.Record()

# Navigate to target webpage
plugin.GotoUrl('http://www.google.com/')
controller.Wait(plugin, -1)

# Stop Recorder
plugin.Stop()

# Export recorded session to HAR file
filename = "C:\\sample_test.har"
har = plugin.Log.ExportHAR(filename)

#Read content of stored file
with open(filename) as file:
har = file.read()

# Send results to HAR Storage
harstorage = HarStorage(HARSTORAGE_HOST, HARSTORAGE_PORT)
print harstorage.save(har)

#Close the browser
plugin.CloseBrowser()
```