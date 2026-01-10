import { getSidebarByPath } from '../../../util/nav';

export default {
  load() {
    return {
      reviewers: getSidebarByPath('docs/guides/reviewers/'),
    };
  },
};
