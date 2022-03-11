<script setup>

</script>
<script>
export default {
    data() {
        return {
            
        }
    },
    methods: {
        toAudiotext() {
            console.log(this);
            this.$router.push('/audiotext')
        }
    }
}
</script>
<template>
<button @click="toAudiotext">转换</button>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
