<template>
  <a :href="link" class="githublink" :style="{ top: topPosition, left: leftPosition }">
    <img src="/githubLogo.png" width="25px" height="25px" />
  </a>
</template>

<script>
export default {
  props: {
    link: String,
    topPosition: String,
    leftPosition: String,
  },
};
</script>

<style>
.githublink {
  position: absolute;
  display: inline-block;
  z-index: 1;
}
</style>
