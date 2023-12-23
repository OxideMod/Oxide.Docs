---
title: Web Requests
after: Timers
---

# Web Requests

## `Enqueue`

The `Enqueue` method is used for sending `POST`, `PUT` and `GET` requests, the method also supports `Headers` which can be supplied via the arguments.

::: details Github Location
[`Enqeue`](https://github.com/OxideMod/Oxide.Core/blob/develop/src/Libraries/WebRequests.cs#L492)
:::

::: details Source Code
```csharp
public void Enqueue(string url, string body, Action<int, string> callback, Plugin owner, RequestMethod method = RequestMethod.GET, Dictionary<string, string> headers = null, float timeout = 0f)
{
    WebRequest request = new WebRequest(url, callback, owner) { Method = method.ToString(), RequestHeaders = headers, Timeout = timeout, Body = body };
    lock (syncroot)
    {
        queue.Enqueue(request);
    }

    workevent.Set();
}
```
:::