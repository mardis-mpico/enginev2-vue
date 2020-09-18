<template>
  <v-app-bar app class="elevation-1" color="white darken-4" light>
    <v-app-bar-nav-icon
      @click.stop="setToggleState(!toggleDrawer)"
    ></v-app-bar-nav-icon>
    <v-toolbar-title>{{title}}</v-toolbar-title>
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
