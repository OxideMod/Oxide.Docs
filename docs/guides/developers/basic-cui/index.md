---
title: CUI library
after: coroutines
---

<script setup>
import { data } from './basic-cui.data.ts'
</script>

# CUI library

Guides for using CUI library

<div class="overview-pager column">
    <a v-for="guide of data.cui" :href="guide.link" class="pager-link">
        <span class="title">{{ guide.text }}</span>
    </a>
</div>

<hr>



