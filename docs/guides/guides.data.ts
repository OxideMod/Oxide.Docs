import { getSidebarByPath } from "../../util/nav";

export default {
  load() {
    return {
      owner: getSidebarByPath("docs/guides/owners/"),
      developer: getSidebarByPath("docs/guides/developers/"),
    }
  },
};
