<template>
  <recursive-content :depth="6" />
</template>

<script>
  import profile from '../profile';

  export default {
    mounted() {
      profile.logTime();
    },

    updated() {
      profile.logTime();
    }
  }
</script>