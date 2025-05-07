# Hook Index

<script setup>
import { data } from './hooks<sup><a href="/glossary#hooks">[7]</a></sup>.data.ts'
import HookSearch from '../../components/HookSearch.vue'
</script>

<HookSearch :in-sidebar="false" />

<div class="overview-pager wrap">
  <a v-for="hook of data" class="pager-link" :href="hook.items[0].link">
    <span class="title">{{ hook.text }}</span>
  </a>
</div>
