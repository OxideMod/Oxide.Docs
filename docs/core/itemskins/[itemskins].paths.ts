import * as fs from "fs";

import { ISkin } from "../../../entities/items/itemskin";
import { replaceAll } from "../../../util/items"
// Read and cache the template file
const template = fs.readFileSync("docs/core/itemskins/template.md").toString();

export default {
  paths() {
    const skinData = JSON.parse(fs.readFileSync("skins.json").toString()) as { itemKey : ISkin[] };
    
    var out = Object.keys(skinData).map((data) => {
        return {
          params: {
            itemskins: replaceAll(data, ".", "_"),
          },
          content: buildFile(skinData[data]),
        };
    });

    return out.flat();
  },
};

function buildFile(entry: ISkin[]) {
  let builtFile = `# ${entry[0].ItemShortName[0].toUpperCase() + entry[0].ItemShortName.substring(1) + (`(${entry.length})`)}\n\n`;

  for (let Idx = 0; Idx < entry.length; Idx++) {
      const skin: ISkin = entry[Idx];

      if (skin.WorkshopId == "0")
        return;

      const icon = `![Image](${skin.IconUrl.replace("large", "small")})`
      builtFile += template
      .replace("{skinName}", skin.Name)
      .replace("{skinId}", (skin.WorkshopId == "0" ? "null" : skin.WorkshopId))
      .replace("{type}", skin.Type)
      .replace("{skinIcon}", icon)
  }

  return builtFile
}
