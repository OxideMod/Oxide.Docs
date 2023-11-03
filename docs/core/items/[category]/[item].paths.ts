import * as fs from "fs";
import { ISkin } from "../../../../entities/items/item";

// Read and cache the template file
const template = fs.readFileSync("docs/core/items/template.md").toString();

export default {
  paths() {
    const skinData = JSON.parse(fs.readFileSync("skins.json").toString()) as { itemKey : ISkin[] };
    
    var out = Object.keys(skinData).map((data) => {
      return Object.keys(skinData[data]).map((entry) => {
        const skin: ISkin = skinData[data][entry];
        return {
          params: {
            category: data.toLowerCase(),
            item: skin.DefinitionId,
          },
          content: buildMarkdownFile(skin),
        };
      });
    });

    return out.flat();
  },
};

function buildMarkdownFile(skin: ISkin) {

    const isMarketable = ("**Item Marketable**: " + "`" + skin.IsMarketable + "`")
    const workshopId = ("\n**Workshop Id**: " + "`" + (skin.WorkshopId == "0" ? "null" : skin.WorkshopId) + "`")
    const icon = `![Image](${skin.IconUrl.replace("large", "small")})`

    let returnFile = template
    .replace("{Title}", skin.Name)
    .replace("{IsMarketable}", isMarketable)
    .replace("{WorkshopId}", workshopId)
    .replace("{Icon}", icon)

    return returnFile;
}

// /*
// {IsMarketable}
// {WorkshopDownload}
// {WorkshopId}
// */