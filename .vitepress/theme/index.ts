// https://vitepress.dev/guide/custom-theme
import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './style.css';
import HookSearch from '../../components/HookSearch.vue';
import GlossaryLinker from './components/GlossaryLinker.vue';

export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'sidebar-nav-before': () => h(HookSearch),
      'layout-bottom': () => h(GlossaryLinker),
    });
  },
  enhanceApp({ app }) {
    // ...
  },
};
