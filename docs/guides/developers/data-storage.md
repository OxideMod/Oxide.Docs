---
title: Data Storage
after: using-decompiler
---

# Data Storage

## Configuration/user data file

As previously mentioned in the section [My first plugin](./my-first-plugin), configuration and user data file use `Newtonsoft.Json` to serialize data structure.  
Configuration files are stored in  `./oxide/config folder`  
User data files are stored in  `./oxide/data`  
Default path can be modified to save in subfolder.  

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

will be serialized to

```json
{
	"A simple message when player spawn" : "a simple reply message",
	"Maximum health value (default=100)" : 100,
	"Zones to prevent something" : [
		"KeepOut"
		]
}
```

## Language data file

The language file is initialized in the LoadDefaultMessages hook. All messages definition will be stored in a file in the `./oxide/lang/(Language code)/(Plugin name).json`.
Only the missing messages are added but it does not overwrite the one already existing. This allows server owners to customize messages to their preference.
Server owners can also translate messages to other languages. for example, messages could be translated into Italian and saved in the `./oxide/lang/it/(Plugin name).json` file  
Note: To revert the language file to the default for a plugin, just delete the file `./oxide/lang/(Language code)/(Plugin name).json`
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

Protobuf store data in a binary format. Main advantage is a more compact and faster data storage, with the disadvantage to not be human readable

`[ProtoContract]`  : to indicates that this class will serialize.  
`[ProtoMember(N)]` : where N represents the number in which order it will serialize  
`[ProtoIgnore]`    : this field will not be serialized.  

### Protobuf class sample

``` csharp
[ProtoContract]
public class sample {
    [ProtoMember(1)]
    public string data1;
    [ProtoMember(2)]
    public List<int> data2;
    [ProtoMember(3)]
    public DateTime data3;
    [ProtoIgnore]
    public int data4;
}
```
### Protobuf Loading
``` csharp
sample mySample
if (ProtoStorage.Exists(filename))
{
	mySample = ProtoStorage.Load<sample>(filename) ?? new sample();
}
else
{
	mySample = new sample();
}
```
### Protobuf Saving
``` csharp
ProtoStorage.Save(mySample, filename);
```

## Database storage

Data can be stored in a database using either `SQLite`  or `MySQL`. 

### SQlite
In an Oxide plugin, SQLite can be used as a lightweight database solution for storing and retrieving data. 
Unlike traditional file-based storage, SQLite allows structured data management through tables, like tracking player statistics. 
Plugins can interact with the database using SQL queries to insert, update, delete, or retrieve information.
Since SQLite is embedded, it eliminates the need for a separate database server, 
making it a convenient choice for smaller-scale applications within game servers. 

Example of SQLite plugin :
```csharp
using Oxide.Core;
using Oxide.Core.Libraries.Covalence;

namespace Oxide.Plugins
{
    [Info("Test SQLite", "Oxide", "1.0.0")]
    public class TestSQLite : CovalencePlugin
    {
        private readonly string _databaseName = "TestSQLite";
        static readonly Oxide.Core.SQLite.Libraries.SQLite sqlite = Interface.Oxide.GetLibrary<Oxide.Core.SQLite.Libraries.SQLite>();
        static Oxide.Core.Database.Connection sqlConnection;

        private void Init()
        {
            sqlConnection = sqlite.OpenDb(_databaseName, this);
            var sql = new Oxide.Core.Database.Sql();
            sql.Append(@"CREATE TABLE IF NOT EXISTS Players (id INTEGER PRIMARY KEY, name TEXT, kills INTEGER);");
            sqlite.Insert(sql, sqlConnection);
        }

        private void InsertPlayerData(string playerName, int kills)
        {
            string query = $"INSERT INTO Players (name, kills) VALUES ('{playerName}', {kills});";
            var sql = new Oxide.Core.Database.Sql();
            sql.Append(query);
            sqlite.Insert(sql, sqlConnection);
        }

        private void ReadPlayerData()
        {
            string query = "SELECT * FROM Players;";
            var sql = new Oxide.Core.Database.Sql();
            sql.Append(query);
            sqlite.Query(sql, sqlConnection, list =>
            {
                foreach (var row in list)
                {
                    Puts($"Player {row["name"]} has {row["kills"]} kills.");
                }
            });
        }

        [Command("addplayer")]
        private void CmdAddPlayer(IPlayer iplayer, string command, string[] args)
        {
            if (args.Length < 2)
            {
                Puts("addplayer, Missing arguments");
                return;
            }
            InsertPlayerData(args[0], int.Parse(args[1]));
            Puts($"Added player {args[0]} with {args[1]} kills.");
        }

        [Command("listplayers")]
        private void CmdListPlayers(IPlayer iplayer, string command, string[] args)
        {
            Puts("listplayers command");
            ReadPlayerData();
        }
    }
}
```

### MySQL
To use MySQL, you need a separate database server. MySQL and MariaDB are the most commonly used server, but other product also be used.

- [MySQL](https://dev.mysql.com/downloads/installer/), version 5.7.X or earlier.  
- [MariaDB](https://mariadb.org/download/?t=mariadb&p=mariadb&r=11.7.2&os=windows&cpu=x86_64&pkg=msi&mirror=osuosl)  version 10.9.8 or earlier.  
