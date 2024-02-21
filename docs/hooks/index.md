# Hook Index

<script setup>
import { data } from './hooks.data.ts'
import HookSearch from '../../components/HookSearch.vue'
</script>

<HookSearch :in-sidebar="false" />

<div class="overview-pager wrap">
  <a v-for="hook of data" class="pager-link" :href="hook.items[0].link">
    <span class="title">{{ hook.text }}</span>
  </a>
</div>