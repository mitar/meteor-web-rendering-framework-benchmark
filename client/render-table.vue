<template>
  <table>
    <tbody>
      <render-table-row v-for="doc in content" :row="doc.row" :key="doc._id" />
    </tbody>
  </table>
</template>

<script>
  import { logTime } from './timing';

  export default {
    props: ['content'],

    mounted() {
      logTime();
    },

    updated() {
      logTime();
    }
  }
</script>