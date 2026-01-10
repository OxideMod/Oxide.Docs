<script setup>
import { data } from './guides.data.ts'
</script>

# Reviewers

Guides for plugin review.

<div class="overview-pager column">
    <a v-for="guide of data.reviewers" :href="guide.link" class="pager-link">
        <span class="title">{{ guide.text }}</span>
    </a>
</div>

<hr>

