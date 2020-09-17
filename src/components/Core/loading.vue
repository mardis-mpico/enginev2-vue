<template>
  <v-container>
    <v-row justify="center">
      <v-overlay
        :absolute="true"
        :opacity="0.5"
        :value="true"
        :z-index="999"
      >
        <v-progress-circular
          indeterminate
          :size="50"
          :width="3"
          color="white"
        ></v-progress-circular>
      </v-overlay>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src

export default {
  name: "loading",
  computed: {
  },
  components: {},
  data() {
    return {};
  },
  methods: {},
  created() {},
};
</script>
