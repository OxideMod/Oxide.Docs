import { getSidebarByPath } from '../../../../util/nav';

export default {
  load() {
    return getSidebarByPath('docs/guides/reviewers/guidelines/');
  },
};
