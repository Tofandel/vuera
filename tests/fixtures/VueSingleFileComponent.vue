<template>
  <div>
    <span><slot></slot></span>
    <button @click="raiseEvent">{{ message }}</button>
  </div>
</template>

<script>
  export default {
    name: 'what',
    props: ['message', 'reset'],
    methods: {
      raiseEvent(e) {
        this.reset(e);
        this.$emit('custom-event', e);
      }
    }
  }
</script>
