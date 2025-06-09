// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import type { Theme } from 'vitepress';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import './skins.css';
import HookSearch from '../../components/HookSearch.vue';
import GlossaryLinker from './components/GlossaryLinker.vue';
import SkinsLayout from './SkinsLayout.vue';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h(HookSearch, { inSidebar: true }),
      'layout-bottom': () => h(GlossaryLinker),
    });
  },
  enhanceApp({ app }) {
    app.component('SkinsLayout', SkinsLayout);
  },
} satisfies Theme;
