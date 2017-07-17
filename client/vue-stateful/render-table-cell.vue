<template>
  <td><button @click="clicked">{{cell.value}}</button></td>
</template>

<script>
  export default {
    props: ['cell'],

    methods: {
      clicked(event) {
        console.log('Clicked!');
      }
    }
  }
</script>