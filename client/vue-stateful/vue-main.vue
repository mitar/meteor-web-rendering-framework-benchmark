<template>
  <other v-if="selection === 'other'" />
  <recursive v-else-if="selection === 'recursive'" />
  <table1 v-else-if="selection === 'table1'" />
  <table2 v-else-if="selection === 'table2'" />
  <table3 v-else-if="selection === 'table3'" />
</template>

<script>
  export default {
    props: ['selection']
  }
</script>