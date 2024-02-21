import { existsSync, readFileSync } from "fs";
import { getGroupedHooks } from "../../../util/hooks";
import IHook from "../../../entities/hooks/hook";
import ReturnBehaviour from "../../../entities/hooks/returnBehaviour";

enum HookSection {
  Usage = "Usage",
  Alerts = "Alerts",
  Example = "Example",
  Location = "Location",
  Description = "Description",
}

// Read and cache the template file
const template = readFileSync("docs/hooks/template.md").toString();

export default {
  paths() {
    const groupedHooks = getGroupedHooks();

    //TODO: Make this a bit more readable
    var out = Object.keys(groupedHooks).map((category) => {
      return Object.keys(groupedHooks[category]).map((hookName) => {
        const hooks = groupedHooks[category][hookName];
        return {
          params: {
            category: category.toLowerCase(),
            hook: hookName,
          },
          content: buildMarkdownFile(hooks),
        };
      });
    });

    return out.flat();
  },
};

function buildMarkdownFile(hooks: IHook[]) {
  let overwrite = null;

  // Check if the hook has an overwrite
  const hookOverwrite = `docs/hooks/overwrites/${hooks[0].Category}/${hooks[0].Name}.md`;
  if (existsSync(hookOverwrite)) {
    overwrite = readFileSync(hookOverwrite, "utf-8").toString();
  }

  // Use the overwrite if it exists otherwise generate default markdown
  const usage = getSection(overwrite, HookSection.Usage) ?? getUsageReturn(hooks[0]);
  const alerts = getSection(overwrite, HookSection.Alerts) ?? getHookAlerts(hooks);
  const examplesOverwrite = getSection(overwrite, HookSection.Example);
  const examples = examplesOverwrite ?? getExamplesMarkdown(hooks);
  const location = getSection(overwrite, HookSection.Location) ?? getLocationMarkdown(hooks);
  const description = getSection(overwrite, HookSection.Description) ?? getHookDescription(hooks);

  // Replace the template with the hook data
  const hookMarkdown = template
    .replace("{title}", hooks[0].Name.replace(/\[.*\]/g, ''))
    .replace("{description}", description)
    .replace("{usage}", usage)
    .replace("{alerts}", alerts)
    .replace("{examples}", examples)
    .replace("{examples-badge}", examplesOverwrite == null ? "<Badge type=\"warning\">Autogenerated</Badge>" : '')
    .replace("{location}", location);

  return hookMarkdown;
}

// Get section of markdown file by section title
function getSection(fileContent: string, sectionName: string) {
  fileContent += "#"; //TODO: Fix this hack
  const escapedSectionName = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`# ${escapedSectionName}([\\s\\S]*?)(?=^#|\Z)`, "gm");
  const match = regex.exec(fileContent);

  if (match) {
    return match[1].trim();
  }

  return null;
}

// Loop through all hooks and get all unique descriptions
function getHookDescription(hooks: IHook[]) {
  const output = [];

  for (const hook of hooks) {
    if (hook.HookDescription && !output.includes(hook.HookDescription)) {
      output.push(hook.HookDescription);
    }
  }

  return output.join("\n");
}

function getHookAlerts(hooks: IHook[]) {
  const output = [];

  if (hooks.some((hook) => hook.HookName.startsWith("I")))
  {
    output.push(`
::: warning
This is an internal hook and will not be called in plugins. See [Internal Hooks](/glossary#internal-hooks) for more information.
:::
`);
  }

  return output.join("\n");
}

// Get the return behavior of the hook by return behavior type
function getUsageReturn(hookData: IHook) {
  if (hookData.ReturnBehavior === ReturnBehaviour.Continue) {
    return "* No return behavior";
  }

  if (hookData.ReturnBehavior === ReturnBehaviour.ExitWhenValidType) {
    return "* Return a non-null value to override default behavior";
  }

  if (hookData.ReturnBehavior === ReturnBehaviour.ExitWhenNonNull) {
    return "* Return a non-null value or bool to override default behavior";
  }

  //TODO: Get the return type of the hook
  if (hookData.ReturnBehavior === ReturnBehaviour.UseArgumentString) {
    return "* Return TYPE to prevent default behavior";
  }

  return "* No return behavior";
}

// Generate example code for the hook
function getExamplesMarkdown(hooks: IHook[]) {
  let output = "";

  // Filter out hooks that have same parameters types preventing duplicate examples
  hooks = hooks.reduce((acc, hook) => {
    if (!acc.some((h) => {
      if (h.HookParameters && hook.HookParameters) {
        return Object.keys(h.HookParameters).every((key) => h.HookParameters[key] === hook.HookParameters[key]);
      }
      return false;
    })) {
      acc.push(hook);
    }
    return acc;
  }, [] as IHook[]);

  for (const hook of hooks) {
    output += `\`\`\`csharp`;
    //TODO: Use proper return type instead of void
    output += `\nprivate void ${hook.HookName}( ${getArgumentString(hook.HookParameters)} )`;
    output += `\n{`;
    output += `\n    Puts( "${hook.HookName} works!" );`;
    output += `\n}`;
    output += `\n\`\`\`\n`;
  }

  return output;
}

// Generate the location of the hook in the games source code
function getLocationMarkdown(hooks: IHook[]) {
  let output = "";

  for (const hook of hooks) {
    output += escapeBrackets(
      `- ${hook.TargetType.replace(/`1/g, '&lt;T&gt;')}::${hook.MethodData.MethodName}(${getArgumentString(hook.MethodData.Arguments)})\n`
    );
  }

  hooks = hooks.filter(hook => hook.CodeAfterInjection && hook.CodeAfterInjection !== "")

  if (hooks.length === 0) {
    return output;
  }

  output += "::: code-group\n";

  for (const hook of hooks) {
    output += `\`\`\`csharp{${getHookLineIndex(hook)}} [${escapeBrackets(hook.TargetType).replace(/`1/g, '&lt;T&gt;')}]\n`;
    output += `${hook.CodeAfterInjection?.replace(/global::/g, '').replace(/`1/g, '&lt;T&gt;')}\n`;
    output += "```\n";
  }

  output += ":::";

  return output;
}

// Get the line index of the hook in the games source code (for highlighting)
function getHookLineIndex(hookData: IHook) {
  if (!hookData.CodeAfterInjection) {
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

// Get the argument string from key value pairs
function getArgumentString(args: { [key: string]: string }) {
  if (!args) {
    return "";
  }

  let argArray = [];

  for (const object of Object.entries(args)) {
    argArray.push(`${object[1]} ${object[0]}`);
  }

  return argArray.join(", ");
}

function escapeBrackets(input: string): string {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
