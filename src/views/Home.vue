<template>
  <div>
    <v-container v-if="getShowHomeContent" fluid fill-height class="d-block">
      <v-layout column align-center justify-center>
        <img
          src="@/assets/engine.png"
          alt="Vue Material Admin"
          width="260"
          height="100"
        />
        <v-row class="align-center pt-10">
          <h5 class="pr-2">powered by</h5>
          <img
            src="@/assets/chariot.png"
            alt="Vue Material Admin"
            width="110"
            height="30"
          />
        </v-row>
      </v-layout>
    </v-container>
    <router-view />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// @ is an alias to /src

export default {
  name: "Home",
  computed: {
    ...mapGetters(["getShowHomeContent"])
  },
};
</script>
