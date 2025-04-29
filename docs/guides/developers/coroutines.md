---
title: Coroutines
after: pooling
---

# Coroutines  ( Unity )
 
Coroutines are usefull for tasks that run across multiple frames. Like waiting to HTTP transfers, 
Remember that coroutines are not threads. coroutines operation execute on the main thread of the game.

see [Unity documentation about coroutine](https://docs.unity3d.com/6000.1/Documentation/Manual/coroutines.html)

Example of coroutine sending http message to Discord 

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