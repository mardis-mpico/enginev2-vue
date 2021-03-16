<template>
  <v-app id="login" class="accent">
    <v-main>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm7 md4 lg4>
            <ValidationObserver
              ref="obs"
              v-slot="{ invalid, validated, handleSubmit }"
            >
              <v-card class="elevation-5 pa-3">
                <v-card-text>
                  <div class="layout column align-center">
                    <img
                      src="@/assets/engine.png"
                      alt="Vue Material Admin"
                      width="220"
                      height="90"
                    />
                  </div>
                  <v-form>
                    <ValidationProvider
                      name="usuario"
                      rules="required|email"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        class="v-text-field"
                        v-model="email"
                        label="E-mail"
                        name="email"
                        append-icon="mdi-email"
                        type="text"
                        color="accent"
                        autocomplete="username"
                        :error-messages="errors"
                      ></v-text-field>
                    </ValidationProvider>

                    <ValidationProvider
                      name="contraseña"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <v-text-field
                        v-model="password"
                        label="Contraseña"
                        name="password"
                        color="accent"
                        autocomplete="new-password"
                        :type="hidePassword ? 'password' : 'text'"
                        :append-icon="hidePassword ? 'mdi-eye-off' : 'mdi-eye'"
                        :error-messages="errors"
                        @click:append="hidePassword = !hidePassword"
                      ></v-text-field>
                    </ValidationProvider>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    :dark="!invalid && validated"
                    @click="handleSubmit(submit)"
                    :disabled="invalid || !validated"
                    block
                    color="accent"
                    :loading="loading"
                    >Login</v-btn
                  >
                </v-card-actions>
                <div class="layout row align-center justify-center footerImage">
                  <h5 class="pr-2">powered by</h5>
                  <img
                    src="@/assets/chariot.png"
                    alt="Vue Material Admin"
                    width="110"
                    height="30"
                  />
                </div>
              </v-card>
            </ValidationObserver>
          </v-flex>
        </v-layout>
      </v-container>
      <v-snackbar
        :multi-line="true"
        :timeout="2500"
        :value="error"
        transition="true"
        absolute
        bottom
        elevation="24"
        color="error"
      >
        {{ errorMessage }}
        <template v-slot:action="{ attrs }">
          <v-btn icon color="white" v-bind="attrs" @click="restoreErrors">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </v-main>
    <footer class="layout align-end justify-center">
      <p class="text-center footerText">
        Copyright © 2017-2021 CHARIOT Todos los derechos reservados |
        Desarrollado por DI
      </p>
    </footer>
  </v-app>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { mapActions, mapMutations, mapState } from "vuex";

export default {
  name: "Login",
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      hidePassword: true,
      email: "",
      password: "",
    };
  },
  computed: {
    ...mapState(["error", "errorMessage"]),
    ...mapState(["loading"]),
  },
  watch: {
    error(newVal) {
      if (newVal) {
        setTimeout(() => {
          this.restoreErrors();
        }, 2000);
      }
    },
  },
  methods: {
    ...mapActions("auth", ["signIn"]),
    ...mapMutations(["restoreErrors"]),

    async submit() {
      await this.signIn({
        Email: this.email,
        Password: this.password,
      });
      this.$router.replace("/Home");
    },
  },
};
</script>

<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
.footerImage {
  margin: 20px;
}
.footerText {
  font-size: 11px;
  font-weight: bold;
}
</style>
