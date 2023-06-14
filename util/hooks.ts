import { readFileSync } from "fs";

export function getHookJson() {
  const hookData = readFileSync("docs.json").toString();
  return JSON.parse(hookData);
}

export function getGroupedHooks() {
  const hooksJson = getHookJson();

  var out = {};

  hooksJson.Hooks.forEach((hook) => {
    if (!out[hook.Category]) {
      out[hook.Category] = {};
    }

    if (!out[hook.Category][hook.HookName]) {
      out[hook.Category][hook.HookName] = [];
    }

    out[hook.Category][hook.HookName].push(hook);
  });

  // Sort categories, hooks and hooks by TargetType and MethodData.MethodName using tolocaleCompare
  Object.keys(out).forEach((category) => {
    out[category] = Object.keys(out[category])
      .sort((a, b) => a.localeCompare(b))
      .reduce((obj, key) => {
        obj[key] = out[category][key].sort((a, b) => {
          if (a.TargetType === b.TargetType) {
            return a.MethodData.MethodName.localeCompare(
              b.MethodData.MethodName
            );
          }
          return a.TargetType.localeCompare(b.TargetType);
        });
        return obj;
      }, {});
  });

  return out;
}

export function getHooksSidebar() {
  let data = getGroupedHooks();

  return Object.keys(data).sort().map((category) => {
    return {
      text: category + " (" + Object.keys(data[category]).length + ")",
      collapsed: true,
      items: Object.keys(data[category]).map((hookName) => {
        return {
          text: hookName,
          link: `/hooks/${category.toLowerCase()}/${hookName}`,
        };
      }),
    };
  });
}
