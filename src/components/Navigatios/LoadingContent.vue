<template>
  <v-layout column class="loadingSet" align-center>
    <v-progress-circular
      indeterminate
      :size="50"
      :width="3"
      color="grey"
    ></v-progress-circular>
    <h3 class="pt-5 colorL">Cargando</h3>
  </v-layout>
</template>

<script>
import { http } from "@/plugins/axios";
import { mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters(["getUserData"])
  },
  methods: {
    async getRoutes() {

      try {
        const response = await http.post(
        // `/Login/GetMenubyProfile?idprofile=${this.getUserData.idProfile}`
       `/Login/GetMenubyProfile?idprofile=D6BD9623-89AD-481B-8797-0805EDF0AD69`
        );
        this.$emit(`Routes`, response);
      } catch (e) {
        this.$emit(`Routes`, e);
      }
    },
  },
  mounted() {
    this.getRoutes();
  },
};
</script>

<style scoped>
.loadingSet {
  position: absolute;
  top: 45%;
  left: 50%;
  right: 50%;
}
.colorL {
  color: grey;
}
</style>
