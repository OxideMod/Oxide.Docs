import * as fs from "fs";

import { ISkin } from "../entities/items/itemskin"

export function replaceAll(toSearch: string, toReplace: string, replaceWith) {
  let replacedString = toSearch;

  for (let Idx = 0; Idx < toSearch.length; Idx++)
      replacedString = replacedString.replace(toReplace, replaceWith);

  return replacedString;
}

export function getItemSkins() {
  let skinData = JSON.parse(fs.readFileSync("skins.json").toString()) as { itemKey : ISkin[] };
  return Object.keys(skinData).map((category) => {
    return {
      text: category[0].toUpperCase() + category.substring(1) + (`(${skinData[category].length})`),
      link: `/core/itemskins/${replaceAll(category, ".", "_")}`,
    };
  });
}
  