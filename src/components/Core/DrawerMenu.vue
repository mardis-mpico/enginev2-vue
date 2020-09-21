<template>
  <!--<v-navigation-drawer
    v-model="toggleDrawer"
    app
    floating
    :permanent="toggleDrawer"
    :mini-variant.sync="mini"
    dark
    color="grey darken-4"
  >-->
  <v-navigation-drawer
    v-model="toggleDrawer"
    app
    floating
    :permanent="toggleDrawer"
    :mini-variant="true"
    color="secondary"
  >
    <v-list dense nav class="py-0">
      <!--<v-tooltip :disabled="!mini" right>-->
      <v-tooltip :disabled="false" right>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
            two-line
            :class="true && 'px-0'"
            v-bind="attrs"
            v-on="on"
            @click="$emit(event, 'Cuenta')"
            link
            to="/Home/Account"
          >
            <v-list-item-avatar>
              <img src="https://randomuser.me/api/portraits/men/81.jpg" />
            </v-list-item-avatar>

            <v-list-item-content>
              <v-list-item-title>{{ getUserData.name }}</v-list-item-title>
              <v-list-item-subtitle>{{
                getUserData.email
              }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>Cuenta</span>
      </v-tooltip>
      <v-divider></v-divider>

      <!--<v-tooltip
        :disabled="!mini"
        right
        v-for="route in routes"
        :key="route.name"
      >-->
      <v-tooltip
        :disabled="false"
        right
        v-for="route in routes"
        :key="route.name"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
            link
            :to="route.urlMenu"
            @click="$emit(event, { name: route.name })"
            v-bind="attrs"
            v-on="on"
            active-class="accent--text"
          >
            <v-list-item-icon >
              <v-icon >{{ route.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ route.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>{{ route.name }}</span>
      </v-tooltip>

      <!--<v-tooltip :disabled="!mini" right>-->
      <v-tooltip :disabled="false" right>
        <template v-slot:activator="{ on, attrs }">
          <v-list-item
            link
            @click="$emit(event, { name: 'logout' })"
            v-bind="attrs"
            v-on="on"
          >
            <v-list-item-icon>
              <v-icon>mdi-exit-to-app</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Cerrar sesión</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <span>Cerrar sesión</span>
      </v-tooltip>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  props: {
    routes: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      sidebarMenu: true,
      toggleMini: false,
      event: "NavOption",
    };
  },
  methods: {
    ...mapMutations(["setToggleState"]),
  },
  computed: {
    toggleDrawer: {
      get() {
        return this.$store.state.toggleState;
      },
      set(newValue) {
        this.setToggleState(newValue);
      },
    },
    /*mini() {
      return this.$vuetify.breakpoint.smAndDown || this.toggleMini;
    },*/
    bg() {
      return this.background
        ? "https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        : undefined;
    },
    ...mapGetters(["getUserData"]),
  },
};
</script>

<style>

::-webkit-scrollbar {
  width: 8px;
  background-color: #111;
}

::-webkit-scrollbar-thumb {
  background-color: #222;
}

::-webkit-scrollbar-thumb:hover {
  background-color: #444;
}

::-webkit-scrollbar-track {
  box-shadow: inset 0 0 4px rgba(0, 0, 0, 0.6);
  background-color: #333;
}

::-webkit-scrollbar-track:hover {
  background-color: #292929;
}

.item-title {
  font-size: 17px;
  font-weight: 500;
}
.item-sub-title {
  font-size: 15px;
  font-weight: 500;
}
</style>
