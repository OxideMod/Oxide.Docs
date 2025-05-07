---
title: Web Requests
after: Timers
---

# Web Requests

## Understanding Web Requests

Oxides WebRequests library is responsible for handling HTTP requests asynchronously, when utilized in your plugin it can effectively and efficiently communicate with web resources.

## Using `Enqeue` to send a `GET Request`

```csharp
webrequest.Enqueue("http://www.google.com/search?q=umod", null, (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.GET);
```

Advanced GET Request

```csharp
[Command("get")]
private void GetRequest(IPlayer player, string command, string[] args)
{
    // Set a custom timeout (in milliseconds)
    float timeout = 200f;

    // Set some custom request headers (eg. for HTTP Basic Auth)
    Dictionary<string, string> headers = new Dictionary<string, string> { { "header", "value" } };

    webrequest.Enqueue("http://www.google.com/search?q=umod", null, (code, response) =>
        GetCallback(code, response, player), this, RequestMethod.GET, headers, timeout);
}

private void GetCallback(int code, string response, IPlayer player)
{
    if (response == null || code != 200)
    {
        Puts($"Error: {code} - Couldn't get an answer from Google for {player.Name}");
        return;
    }

    Puts($"Google answered for {player.Name}: {response}");
}
```

## Using `Enqeue` to send a `POST Request`

```csharp
webrequest.Enqueue("http://www.google.com/search?q=umod", "param1=value1", (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.POST);
```

## Using `Enqeue` to send a `PUT Request`

```csharp
webrequest.Enqueue("http://www.google.com/search?q=umod", null, (code, response) =>
{
    if (code != 200 || response == null)
    {
        Puts($"Couldn't get an answer from Google!");
        return;
    }
    Puts($"Google answered: {response}");
}, this, RequestMethod.PUT);
```
