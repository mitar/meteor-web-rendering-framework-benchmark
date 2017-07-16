<template>
  <recursive-content :depth="6" />
</template>

<script>
  import { logTime } from './timing';

  export default {
    mounted() {
      logTime();
    },

    updated() {
      logTime();
    }
  }
</script>