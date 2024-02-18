import { getSidebarByPath } from "../../util/nav";

export default {
  load() {
    return {
      commands: getSidebarByPath("docs/core/commands/"),
      libraries: getSidebarByPath("docs/core/libraries/"),
    }
  },
};
