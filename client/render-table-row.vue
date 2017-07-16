<template>
  <tr>
    <render-table-cell v-for="doc in row" :cell="doc.cell" :key="doc._id" />
  </tr>
</template>

<script>
  export default {
    props: ['row']
  }
</script>