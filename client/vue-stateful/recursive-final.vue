<template>
  <button @click="clicked">Bottom!</button>
</template>

<script>
  export default {
    methods: {
      clicked(event) {
        console.log('Clicked!');
      }
    }
  }
</script>