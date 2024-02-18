<script setup>
import { data } from './core.data.ts'
</script>

# Commands

<div class="overview-pager column">
    <a v-for="guide of data.commands" :href="guide.link" class="pager-link">
        <span class="title">{{ guide.text }}</span>
    </a>
</div>

<hr>

# Libraries

<div class="overview-pager column">
    <a v-for="guide of data.libraries" :href="guide.link" class="pager-link">
        <span class="title">{{ guide.text }}</span>
    </a>
</div>
