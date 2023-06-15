import { existsSync, readFileSync } from "fs";
import { getGroupedHooks } from "../../../util/hooks";
import markdownIt from "markdown-it";
const md = new markdownIt();

// {
//   "Type": 0,
//   "Name": "OnPlayerDisconnected",
//   "HookName": "OnPlayerDisconnected",
//   "ReturnBehavior": 0,
//   "TargetType": "ServerMgr",
//   "Category": "Player",
//   "MethodData": {
//     "MethodName": "OnDisconnected",
//     "ReturnType": "void",
//     "Arguments": {
//       "strReason": "string",
//       "connection": "Network.Connection"
//     }
//   },
//   "CodeAfterInjection": "...\r\n\tPlatformService.Instance.EndPlayerSession(connection.userid);\r\n\tglobal::EACServer.OnLeaveGame(connection);\r\n\tglobal::BasePlayer basePlayer = connection.player as global::BasePlayer;\r\n\tif (basePlayer)\r\n\t{\r\n\t\tInterface.CallHook(\"OnPlayerDisconnected\", basePlayer, strReason);\r\n\t\tInterface.CallHook(\"OnPlayerDisconnected\", basePlayer, strReason);\r\n\t\tbasePlayer.OnDisconnected();\r\n\t}\r\n}\r\n\r\n"
// },

export default {
  paths() {
    const groupedHooks = getGroupedHooks();
    
    var out = Object.keys(groupedHooks).map((category) => {
      return Object.keys(groupedHooks[category]).map((hookName) => {
        const hooks = groupedHooks[category][hookName];

        const hookOverwrite = `docs/hooks/${category}/${hookName}.md`;
        // console.log(hookOverwrite);
        // if( existsSync(hookOverwrite) ){
        //   const hookData = readFileSync(`docs/hooks/overwrites/${category}/${hookName}.md`).toString();
        
        //   const markdown = md.parse(hookData, {});
        //   // console.log(markdown);
        // }



        return {
          params: {
            category: category.toLowerCase(),
            hook: hookName,
          },
          content: getHookContent(hooks),
        };
      });
    });

    return out.flat();

//     console.log(groupedHooks);
//     var hookJson = getHookJson();

//     var out = hookJson.Hooks.map((hook) => {
//       return {
//         params: {
//           title: hook.Name,
//           hook: hook.HookName,
//           category: hook.Category.toLowerCase(),
//           data: hook,
//           argString: generateArgumentString(hook.MethodData.Arguments),
//         },
//         content: `# ${hook.Name}
// **Category:** ${hook.Category}

// ## Usage

// ${getUsageReturn(hook)}

// ## Example(s)

// \`\`\`csharp
// private ${hook.ReturnType} ${hook.HookName}( ??? )
// {
//     Puts( "${hook.MethodData.MethodName} works!" );
// }
// \`\`\`

// ## Location
// Called in \`${hook.TargetType}::${hook.MethodData.MethodName}(${ generateArgumentString(hook.MethodData.Arguments) })\`

// \`\`\`csharp
// ${hook.CodeAfterInjection}
// \`\`\`
// `,
//       };
//     });

//     return out;
  },
};

function getHookContent(hooks){
  return `# ${hooks[0].Name}
**Category:** ${hooks[0].Category}

## Usage

${getUsageReturn(hooks[0])}

## Example(s)
${getExamplesMarkdown(hooks)}

## Location
${getLocationMarkdown(hooks)}
`
}

function generateArgumentString(args) {
  let argArray = [];

  for (const key in args) {
    if (args.hasOwnProperty(key)) {
      const element = args[key].replace("/", ".");
      argArray.push(`${element} ${key}`);
    }
  }

  return argArray.join(", ");
}

function getUsageReturn(hookData) {
  if (hookData.MethodData.ReturnType.includes("void")) {
    return "* No return behavior";
  }

  if (hookData.MethodData.ReturnType.includes("bool")) {
    return "* Returning true or false overrides default behavior";
  }

  if (hookData.MethodData.ReturnType.includes("Item")) {
    return "* Return an Item to prevent default behavior & override the received Item";
  }

  return "* Return a non-null value to override default behavior";
}


function getLocationMarkdown(hooks) {
  var thing =  `${hooks.map((hook) => `- ${hook.TargetType}::${hook.MethodData.MethodName}(${ generateArgumentString(hook.MethodData.Arguments) })`).join("\n")}`;

  thing = thing.escapeBrackets();

thing+= `
::: code-group

${hooks.map((hook) => `\`\`\`csharp{${getHookLineIndex(hook)}} [${hook.TargetType.escapeBrackets()}]
${hook.CodeAfterInjection}
\`\`\``).join("\n")}

:::
`;

return thing;
}

function getExamplesMarkdown(hooks) {
 let thing = hooks.map((hook) => `\`\`\`csharp
private ${hook.ReturnType} ${hook.HookName}( ??? )
{
    Puts( "${hook.MethodData.MethodName} works!" );
}
\`\`\`
`).join("\n");

return thing;
}



//   return `## Location
// Called in \`${hookData.TargetType}::${hookData.MethodData.MethodName}(${ generateArgumentString(hookData.MethodData.Arguments) })\`

// \`\`\`csharp
// ${hookData.CodeAfterInjection}
// \`\`\`
// `;
// }

function getHookLineIndex(hookData) {
  if(!hookData.CodeAfterInjection){
    return -1;
  }

  var data = hookData.CodeAfterInjection.split("\r\n");

  for (let index = 0; index < data.length; index++) {
    const line = data[index];

    if (line.includes(hookData.HookName)) {
      return index + 1;
    }
  }

  return -1;
}

declare global {
  interface String {
    escapeBrackets(): string;
  }
}

String.prototype.escapeBrackets = function (): string {
  return this.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
