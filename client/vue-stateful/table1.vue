<template>
  <render-table :content="content" />
</template>

<script>
  import profile from '../profile';
  import collections from '../collections';

  export default {
    meteor: {
      content() {
        return Object.freeze(collections[0].find({}, {sort: {order: 1}}).fetch());
      },
    },

    mounted() {
      profile.logTime();
    },

    updated() {
      profile.logTime();
    }
  }
</script>