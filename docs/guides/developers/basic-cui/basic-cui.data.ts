import { getSidebarByPath } from '../../../../util/nav';

export default {
  load() {
    return {
      cui: getSidebarByPath('docs/guides/developers/basic-cui'),
    };
  },
};
