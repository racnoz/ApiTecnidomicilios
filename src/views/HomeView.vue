<template>
  <div class="home">
    <h1>Técnicos-Tecnidomicilios</h1>
    <br>
    <br>
    <api-app/>
  </div>
</template>

<script>
import apiApp from '../components/apiApp.vue'

export default {
  name: 'HomeView',
  components: {
    apiApp,
  }
}
</script>
