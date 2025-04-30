---
title: Coroutines
after: pooling
---

# Coroutines ( Unity )

The coroutines are useful for tasks that takes a long time and run across multiple frames. Like waiting to HTTP transfers, complex user interface, and other situations.
A downside of using coroutines is the way that they use heap memory.
Remember that coroutines are not threads. The coroutines operation execute on the main thread of the game.

see [Unity documentation about coroutines](https://docs.unity3d.com/6000.1/Documentation/Manual/coroutines.html)

## Creating time slices

The coroutines execute on the main thread and without yielding, a coroutine can take all the CPU time for too long and break the flow of the main task.
For coroutines to work well with the main task, it needs to suspend execution in short time slices.
The method to suspend task is to use the yield return keywords, and whatever comes after the return keyword specifies how long the coroutine should be paused for.
The coroutines return type needs to be an IEnumerator.  
Here are the different `yield return` format :

- `yield return null;` will yield execution of the coroutine and wait for the next frame.
- `yield return new WaitForSeconds(waitTime);` will yield execution until the scaled time is elapsed. Parameter waitTime can be many seconds, or fractions of seconds.
- `yield return new WaitForSecondsRealtime(waitTime);` will yield execution until the unscaled time is elapsed.
- `yield return new WaitForEndOfFrame();` Waits until the end of the current frame before continuing.
- `yield return new WaitForFixedUpdate();` Waits until the next physics update (FixedUpdate).
- `yield return new WaitUntil(Method<bool> condition);` Waits until a specified condition is met.
- `yield return new WaitWhile(Method<bool> condition);` Waits while a specified condition remains true.
- `yield return StartCoroutine(anotherCoroutine);` Waits for another coroutine to finish before continuing.
- `yield return IEnumerator;` will yield execution when calling the IEnumerator method. The IEnumerator method can also yield.

## Stopping coroutines

In this example, ProcessQueue routine will loop and process messages from the \_queue.
When the queue is empty, the method will just exit and terminate the coroutine.
It's also possible to force stop coroutines by using `StopCoroutine` and `StopAllCoroutines`.

## Example

An example of coroutine sending http message to Discord. Messages are stored in a queue to be processed later by the ProcessQueue coroutine.

```csharp
private class DiscordComponent : MonoBehaviour
{
	private readonly Queue<object> _queue = new Queue<object>();
	// URL generated in Discord
	private string _url;
	// coroutine busy status flag
	private bool _busy = false;

	public DiscordComponent Configure(string url)
	{
		if (url == null) throw new ArgumentNullException(nameof(url));
		_url = url;
		return this;
	}

	// Add a message to a queue
	public DiscordComponent SendTextMessage(string message, params object[] args)
	{
		message = args.Length > 0 ? string.Format(message, args) : message;
		return AddQueue(new MessageRequest(message));
	}

	private DiscordComponent AddQueue(object request)
	{
		_queue.Enqueue(request);
		if (!_busy)
			StartCoroutine(ProcessQueue());
		return this;
	}

	// Coroutine to process message queue
	private IEnumerator ProcessQueue()
	{
		if (_busy) yield break;
		_busy = true;
		while (_queue.Count!=0)
		{
			var request = _queue.Dequeue();
			yield return ProcessRequest(request);
		}
		_busy = false;
	}

	private IEnumerator ProcessRequest(object request)
	{
		// Code to send message to discord
		byte[]  data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(request));
		UploadHandlerRaw uh = new UploadHandlerRaw(data) { contentType = "application/json" };
		UnityWebRequest www = UnityWebRequest.PostWwwForm(_url, UnityWebRequest.kHttpVerbPOST);
		www.uploadHandler = uh;
		yield return www.SendWebRequest();

		if (www.result == UnityWebRequest.Result.ConnectionError ||
			www.result == UnityWebRequest.Result.ProtocolError)
			print($"ERROR: {www.error} | {www.downloadHandler?.text}");

		www.Dispose();

		// Wait 2 second between message to avoid spamming Discord
		yield return new WaitForSeconds(2.0f);
	}
}

private class MessageRequest
{
	[JsonProperty("content")]
	public string Content { get; set; }

	public MessageRequest(string content)
	{
		if (content == null) throw new ArgumentNullException(nameof(content));
		Content = content;
	}
}
```
