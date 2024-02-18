<script setup>
import { data } from './guides.data.ts'
</script>

# Server Owner Guides

Guides for server owners to help them get the most out of their server.

<div class="overview-pager column">
    <a v-for="guide of data.owner" :href="guide.link" class="pager-link">
        <span class="title">{{ guide.text }}</span>
    </a>
</div>

<hr>

# Developer Guides

Guides for developers to help them get the most out of their server.

<div class="overview-pager column">
    <a v-for="guide of data.developer" :href="guide.link" class="pager-link">
        <span class="title">{{ guide.text }}</span>
    </a>
</div>
