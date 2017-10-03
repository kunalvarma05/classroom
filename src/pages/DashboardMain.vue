<template>
  <div class="dashboard-main-page">
    <h1>Dashboard</h1>
    <v-btn flat @click.native='logout'>Logout</v-btn>
  </div>
</template>

<script>
  export default {
    name: 'dashboard-main'
  }
</script>
