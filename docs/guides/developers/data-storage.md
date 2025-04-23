---
title: Data Storage
after: using-decompiler
---

# Data Storage

## Configuration/user data file

As previously mentioned in section [My first plugin](./my-first-plugin), configuration and user data file use `Newtonsoft.Json` to serialize data structure.

the basic data structure 
```csharp
private class Configuration
{
	public string ReplyMessage;
}
```
will be serialised to
```json
{
	"ReplyMessage" : "a simple reply message"
}
```
Best practice is to use [NewtonSoft serialization attributes](https://www.newtonsoft.com/json/help/html/SerializeObject.htm) for clarity and easy readability.
Most commonly use attributes :
```csharp
private class PluginData
{
	[JsonProperty(PropertyName = "A simple message when player spawn")]
	public string ReplyMessage;
	
	// Add some info about default value
	// or possible range of the data
	[JsonProperty(PropertyName = "Maximum health value (default=100)")]
	public int MaxHealth = 100;
	
	// because sometime you need data that does not need to be saved
	[JsonIgnore]  
	public Vector3 Position;

	// Here, ObjectCreationHandling is required, 
	// to avoid initialisation data to be added over and over, each time plugin restart.
	[JsonProperty(PropertyName = "Zones to prevent something", ObjectCreationHandling = ObjectCreationHandling.Replace)]
	public List<string> Zones = new List<string> { "KeepOut" };	
}
```
## Language data file

The language file is initialized in the LoadDefaultMessages hook. All messages definition will be stored in a file in the ./oxide/lang/[Language code]/[Plugin name].json.
Only the missing messages are added but it does not overwrite the one already existing. This allows server owners to customize messages to their preference.
Server owners can also translate messages to other languages. for example, messages could be translated into Italian and saved in the ./oxide/lang/it/[Plugin name].json file  
Note: To revert the language file to the default for a plugin, just delete the file ./oxide/lang/{Language code]/[Plugin name].json
``` csharp
private new void LoadDefaultMessages()
{
	lang.RegisterMessages(new Dictionary<string, string>
	{
		["MSG1"]  = "English string 1",
		["MSG2"]  = "English string 2",
		...
	}, this, "en");

	lang.RegisterMessages(new Dictionary<string, string>
	{
		["MSG1"]  = "Localised string for message 1",
		["MSG2"]  = "Localised string for message 2",
	}, this, "fr");
	
	// ... other languages	
}
```

ex: The previous test plugin would initialise a file ./oxide/lang/en/test.json that can be edited by server owners.
```json
{
  "MSG1": "English string 1",
  "MSG2": "English string 1",
}
```

Sample code to retrieving translated message from the language file using the lang.GetMessage function.
``` csharp
private string Lang(string key, string id = null, params object[] args) => string.Format(lang.GetMessage(key, this, id), args);
```

### Language code per country/language
| Country | Language code | Country | Language code | Country | Language code |
| :---------------- | :------: | :---------------- | :------: | :---------------- | :------: |
| Afrikaans        | af    | Arabic        | ar   | Catalan          | ca    |
| Czech            | cs    | Denmark       | da   | Deutsch          | de    |
| Greek            | el    | English       | en   | Pirate english   | en-pt |
| Spanish          | es-ES | Finland       | fi   | French           | fr    |
| Hebrew           | he    | Hungarian     | hu   | Italian          | it    |
| Japan            | ja    | Korea         | ko   | Netherland       | nl    |
| Norwegian        | no    | Polish        | pl   | Portuguese Brazil | pt-BR |
| Portuguese Portugal | pt-PT | Romania       | ro   | Russia       | ru    |
| Serbian          | sr    | Swedish       | sv   | Turkish          | tr    |
| Ukrainian        | uk    | Vietnamese    | vi   |                  |       |
| Simplified Chinese | zh-CN | Traditional Chinese |  zh-TW   |        |       |


## Protobuf storage

see ProtoStorage class

``` csharp
[ProtoContract]
public class sample {
    [ProtoMember(1)]
    public string data1;
    [ProtoMember(2)]
    public List data2;
    [ProtoMember(3)]
    public DateTime data3;
    [ProtoMember(4)]
    public int data4;
}
```

``` csharp
if ProtoStorage.Exists(filename)
   sample mySample = ProtoStorage.Load(filename) ?? new sample();
else
   sample mySample = new sample();
```

``` csharp
ProtoStorage.Save(mySample, filename);
```

## Database storage




