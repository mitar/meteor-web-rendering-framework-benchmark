<template>
  <ul>
    <li>
      <p>Depth {{depth}}</p>
      <template v-if="depth">
        <recursive-content :depth="nextDepth" :key="1" />
        <recursive-content :depth="nextDepth" :key="2" />
        <recursive-content :depth="nextDepth" :key="3" />
        <recursive-content :depth="nextDepth" :key="4" />
        <recursive-content :depth="nextDepth" :key="5" />
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