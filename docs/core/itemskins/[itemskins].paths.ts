import * as fs from 'fs';

import { ISkin } from '../../../entities/items/itemskin';
import { replaceAll } from '../../../util/items';
// Read and cache the template file
const template = fs.readFileSync('docs/core/itemskins/template.md').toString();

export default {
  paths() {
    try {
      // Try to read from root directory first (for backward compatibility)
      let skinData;
      try {
        skinData = JSON.parse(fs.readFileSync('skins.json').toString());
      } catch (error) {
        // If not found in root, try from data directory
        skinData = JSON.parse(fs.readFileSync('data/skins.json').toString());
      }

      // Check for new format with 'items' array
      if (skinData.items) {
        // Convert to old format for backwards compatibility
        const convertedData = {};

        // Group by item type or use a default group
        skinData.items.forEach(item => {
          const itemKey = item.asset_description?.type || 'Unknown';
          if (!convertedData[itemKey]) {
            convertedData[itemKey] = [];
          }

          convertedData[itemKey].push({
            Name: item.name || 'Unknown',
            WorkshopId: item.workshop_id || '0',
            Type: item.asset_description?.type || 'Unknown',
            IconUrl: item.asset_description?.icon_url || '',
            ItemShortName: item.name || 'Unknown',
          });
        });

        skinData = convertedData;
      }

      var out = Object.keys(skinData).map(data => {
        return {
          params: {
            itemskins: replaceAll(data, '.', '_'),
          },
          content: buildFile(skinData[data]),
        };
      });

      return out.flat();
    } catch (error) {
      console.error('Error processing skins.json:', error);
      return []; // Return empty array if file not found or error
    }
  },
};

function buildFile(entry: ISkin[]) {
  if (!entry || entry.length === 0) return '# No skins found';

  let builtFile = `# ${entry[0].ItemShortName[0].toUpperCase() + entry[0].ItemShortName.substring(1) + `(${entry.length})`}\n\n`;

  for (let Idx = 0; Idx < entry.length; Idx++) {
    const skin: ISkin = entry[Idx];

    if (skin.WorkshopId == '0') continue;

    const icon = `![Image](${skin.IconUrl.replace('large', 'small')})`;
    builtFile += template
      .replace('{skinName}', skin.Name)
      .replace('{skinId}', skin.WorkshopId == '0' ? 'null' : skin.WorkshopId)
      .replace('{type}', skin.Type)
      .replace('{skinIcon}', icon);
  }

  return builtFile;
}
