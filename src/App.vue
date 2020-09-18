<template>
  <v-app>
    <Loader v-if="loading"></Loader>
    <div v-if="isLogged">
      <div class="app-container" v-if="routesLoaded">
        <Toolbar @toggleNavigationBar="drawer = !drawer" :title="title" />
        <Nav
          @NavOption="executeNavOption"
          class="py-3 elevation-5"
          :routes="routes"
        />
        <v-main>
          <v-container class="px-4 py-0 fill-height" fluid>
            <v-row class="fill-height">
              <v-col>
                <transition name="fade">
                  <router-view />
                </transition>
              </v-col>
            </v-row>
          </v-container>
        </v-main>
        <v-footer
          fluid
          absolute
          color="white darken-4"
          class="py-3 elevation-4"
        >
          <span class="ml-auto overline"
            >Copyright © 2016-2020 Chariot. All rights reserved</span
          >
        </v-footer>
      </div>
      <LoaderContent v-else @Routes="setRoutesToDrawer" />
    </div>
    <div v-else>
      <transition>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
  </v-app>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import Nav from "./components/Core/DrawerMenu";
import Toolbar from "./components/Core/ToolBarMenu";
import Loader from "./components/Core/loading";
import LoaderContent from "./components/Navigatios/LoadingContent";
import LocalStorageService from "./plugins/LocalStorageService";

const localStorageService = LocalStorageService.getService();

export default {
  name: "App",
  data() {
    return {
      drawer: true,
      routesLoaded: false,
      routes: [],
      title: "Home",
    };
  },
  components: {
    Nav,
    Toolbar,
    LoaderContent,
    Loader,
  },
  computed: {
    ...mapState("auth", ["isLogged"]),
    ...mapState(["loading"]),
  },
  methods: {
    ...mapMutations("auth", ["logOut"]),
    executeNavOption(option) {
      if (option.name === "logout") {
        this.logOut();
        localStorageService.clearToken();
        this.$router.push("/login");
      } else {
        this.title = option.name;
      }
    },
    setRoutesToDrawer(response) {
      if (response.status === "Ok") {
        this.routes = response.data.reverse();
        this.routesLoaded = true;
      } 
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

</style>
