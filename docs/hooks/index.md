# Hook Index

<script setup>
import { data } from './hooks.data.ts'
</script>

<div class="pager">
  <a v-for="hook of data" class="pager-link" :href="hook.items[0].link">
    <span class="title">{{ hook.text }}</span>
  </a>
</div>

<!-- Borrowed from VitePress source -->
<style scoped>
.pager {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.pager-link {
  flex: 1 1 auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 11px 16px;
  transition: border-color 0.25s;
  text-decoration: none !important;
}

.pager-link:hover {
  border-color: var(--vp-c-brand);
}

.title {
  display: block;
  line-height: 20px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition: color 0.25s;
}
</style>
