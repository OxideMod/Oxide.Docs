---
title: Guidelines
after: getting-started
---

<script setup>
import { data } from './guidelines.data.ts'
</script>

# Guidelines

<nav class="table-of-contents">
    <ul>
        <li v-for="menuItem of data">
            <a :href="menuItem.link" class="title">{{ menuItem.text }}</a>
        </li>
    </ul>
</nav>
