<template>
  <v-app-bar app class="elevation-1" color="accent" dark>
    <v-app-bar-nav-icon
      @click.stop="setToggleState(!toggleDrawer)"
    ></v-app-bar-nav-icon>
    <v-toolbar-title class="tText">{{title}}</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-app-bar>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    ...mapMutations(["setToggleState"]),
  },
  computed: {
    ...mapGetters(["toggleDrawer"]),
  },
};
</script>

<style scoped>
.tText {
  color: #ffffff;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>