<template>
  <div class="home">

   <gridvue></gridvue>
  </div>
</template>

<script>
// @ is an alias to /src
import gridvue from "../components/grid";

export default {
  name: 'Home',
  components: {
   gridvue,
  }
}
</script>
