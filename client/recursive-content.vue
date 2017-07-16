<template>
  <ul>
    <li>
      <p>Depth {{depth}}</p>
      <template v-if="depth">
        <recursive-content :depth="nextDepth" />
        <recursive-content :depth="nextDepth" />
        <recursive-content :depth="nextDepth" />
        <recursive-content :depth="nextDepth" />
        <recursive-content :depth="nextDepth" />
      </template>
      <template v-else>
        <recursive-final />
      </template>
    </li>
  </ul>
</template>

<script>
  export default {
    props: ['depth'],

    computed: {
      nextDepth() {
        return this.depth - 1;
      }
    }
  }
</script>