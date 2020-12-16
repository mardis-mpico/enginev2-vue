<template>
  <div class="pb-15">
    <v-alert id="alert" type="error" :value="showAlert">
      {{ alertMessage }}
    </v-alert>
    <v-dialog v-model="eraseDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Eliminar Mercaderista</v-card-title>
        <v-card-text
          >¿Está seguro de eliminar el mercaderista? Una vez eliminado, no se
          podrá deshacer.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="accent darken-1" text @click="close('E')"
            >Cancelar</v-btn
          >
          <v-btn color="accent darken-1" dark @click="acceptDelete"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
        <h1 class="tText pr-3">Gestión de Mercaderistas</h1>
      </v-col>
      <v-col class="align-self-center mr-3">
        <v-row justify="end">
          <v-dialog v-model="dialog" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2 text-capitalize"
                medium
                elevation="1"
                color="#ffba69"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left>mdi-account-multiple-plus</v-icon>
                Nuevo
              </v-btn>
            </template>
            <ValidationObserver
              ref="observer"
              tag="form"
              novalidate
              @reset.prevent="reset"
              v-slot="{ handleSubmit }"
            >
              <v-card>
                <v-card-title>
                  <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="nombre"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.name"
                            name="nombre"
                            label="Nombre*"
                            prepend-icon="mdi-account"
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="teléfono"
                          rules="required|numeric|digits:10"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.phone"
                            name="teléfono"
                            label="Teléfono*"
                            prepend-icon="mdi-cellphone-android"
                            required
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="imei"
                          rules="required|numeric"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.imei"
                            name="imei"
                            label="IMEI*"
                            prepend-icon="mdi-code-array"
                            required
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="q-support"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.qsupport"
                            name="q-support"
                            label="Q-Support*"
                            color="accent darken-1"
                            prepend-icon="mdi-barcode-scan"
                            required
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="estado"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-select
                            v-model="computedStatus"
                            name="estado"
                            :items="['ACTIVO', 'INACTIVO']"
                            label="Estado*"
                            prepend-icon="mdi-format-list-checks"
                            required
                            color="accent darken-1"
                            :menu-props="{ top: false, offsetY: true }"
                            :error-messages="errors"
                          ></v-select>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="estado"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-select
                            v-model="computedOffice"
                            :items="['GUAYAQUIL', 'QUITO']"
                            label="Oficina*"
                            prepend-icon="mdi-office-building"
                            required
                            color="accent darken-1"
                            :menu-props="{ top: false, offsetY: true }"
                            :error-messages="errors"
                          ></v-select>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <v-text-field
                          v-model="editedItem.userCel"
                          label="Usuario Móvil*"
                          prepend-icon="mdi-shield-account"
                          required
                          color="accent darken-1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <v-text-field
                          v-model="editedItem.passCel"
                          label="Contraseña*"
                          type="text"
                          prepend-icon="mdi-lock"
                          required
                          color="accent darken-1"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <v-menu
                          v-model="menu1"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="computedStartDateFormatted"
                              label="Fecha de inicio"
                              prepend-icon="mdi-calendar"
                              readonly
                              color="accent darken-1"
                              v-bind="attrs"
                              v-on="on"
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="date1"
                            no-title
                            @input="menu1 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          transition="scale-transition"
                          offset-y
                          max-width="290px"
                          min-width="290px"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <ValidationProvider
                              name="estado"
                              :rules="{
                                dateRange: {
                                  startDate: computedStartDateFormatted,
                                },
                              }"
                              v-slot="{ errors }"
                            >
                              <v-text-field
                                v-model="computedEndDateFormatted"
                                label="Fecha de fin"
                                prepend-icon="mdi-calendar"
                                readonly
                                color="accent darken-1"
                                v-bind="attrs"
                                v-on="on"
                                :error-messages="errors"
                              ></v-text-field>
                            </ValidationProvider>
                          </template>
                          <v-date-picker
                            v-model="date2"
                            no-title
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="accent darken-1" text @click="close('P')"
                    >Salir</v-btn
                  >
                  <v-btn
                    color="accent darken-1"
                    dark
                    @click="handleSubmit(save)"
                    >Guardar</v-btn
                  >
                </v-card-actions>
              </v-card>
            </ValidationObserver>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="justify-lg-space-between">
      <v-col class="pb-2">
        <v-card class="rounded-xl pa-3" rounded="true">
          <v-row class="align-baseline">
            <v-col cols="5" lg="4">
              <h3 class="tText pl-3">Encuestadores en ruta</h3>
            </v-col>
            <v-col class="text-top" lg="8">
              <v-text-field
                v-model="searchQuery"
                dense
                append-icon="mdi-magnify"
                placeholder="Buscar"
                outlined
                color="primary darken-1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            :mobile-breakpoint="0"
            :headers="headers"
            :items="pollsters"
            item-key="id"
            class="elevation-0"
            light
            :fixed-header="true"
            :search="searchQuery"
            :loading="loadingData"
          >
            <template v-slot:[`item.fecha_Inicio`]="{ item }">
              <td>{{ getFormatedDate(item.fecha_Inicio) }}</td>
            </template>
            <template v-slot:[`item.fecha_Fin`]="{ item }">
              <td>{{ getFormatedDate(item.fecha_Fin) }}</td>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small color="accent" class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small color="error" @click="deleteItem(item)">
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="accent" dark @click="getPollsters">Reintentar</v-btn>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { http } from "@/plugins/axios";
import { mapGetters, mapMutations } from "vuex";
import moment from "moment";

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      editedIndex: -1,
      searchQuery: "",
      loadingData: true,
      dialog: false,
      menu1: false,
      menu2: false,
      date1: new moment().format(),
      date2: new moment().format(),
      showAlert: false,
      alertMessage: "",
      eraseDialog: false,
      headers: [
        { text: "NAME", align: "left", value: "name", class: [] },
        { text: "IMEI", value: "imei" },
        { text: "PHONE", value: "phone" },
        { text: "QSUPPORT", value: "qsupport" },
        { text: "F.INICIO", value: "fecha_Inicio" },
        { text: "F.FIN", value: "fecha_Fin" },
        { text: "ESTADO", value: "status" },
        { text: "OFICINA", value: "oficina" },
        { text: "USUARIO MÓVIL", value: "userCel" },
        { text: "PASSWORD MÓVIL", value: "passCel" },
        { text: "ACCIONES", value: "actions", sortable: false },
      ],
      pollsters: [],
      editedItem: {
        id: 0,
        name: "",
        imei: "",
        phone: "",
        qsupport: "",
        fecha_Inicio: new moment().format(),
        fecha_Fin: new moment().format(),
        status: "A",
        oficina: "QUITO",
        idaccount: 0,
        userCel: "",
        passCel: "",
      },
      defaultItem: {
        id: 0,
        name: "",
        imei: "",
        phone: "",
        qsupport: "",
        fecha_Inicio: new moment().format(),
        fecha_Fin: new moment().format(),
        status: "A",
        idaccount: 0,
        oficina: "QUITO",
        userCel: "",
        passCel: "",
      },
    };
  },
  computed: {
    ...mapGetters(["getUserData"]),

    formTitle() {
      return this.editedIndex === -1
        ? "Nuevo Mercaderista"
        : "Editar Mercaderista";
    },

    computedStartDateFormatted() {
      return this.formatDate(this.editedItem.fecha_Inicio);
    },

    computedEndDateFormatted() {
      return this.formatDate(this.editedItem.fecha_Fin);
    },

    computedStatus: {
      get() {
        return this.getStatusFromData();
      },
      set(newValue) {
        this.setStatusFromData(newValue);
      },
    },

    computedOffice: {
      get() {
        return this.getOfficeFromData();
      },
      set(newValue) {
        this.setOfficeFromData(newValue);
      },
    },
  },

  watch: {
    date1(newVal) {
      var time = new moment().format("THH:mm:ss");
      this.editedItem.fecha_Inicio = newVal + "" + time;
    },
    date2(newVal) {
      var time = new moment().format("THH:mm:ss");
      this.editedItem.fecha_Fin = newVal + "" + time;
    },
  },
  methods: {
    //PETICION DE DATOS
    async getPollsters() {
      try {
        this.pollsters = [];
        this.loadingData = true;
        const response = await http.post(
          `/Branch/ListPollster?account=${this.getUserData.idAccount}`
        );
        this.pollsters = response.data;
      } catch (e) {
        this.showAlert = true;
        this.alertMessage = e;
      } finally {
        this.loadingData = false;
        this.closeAlerts();
      }
    },

    //CIERRA LOS POSIBLES MENSAJES DE ALERTA
    closeAlerts() {
      setTimeout(() => {
        this.showAlert = false;
        this.alertMessage = "";
      }, 3500);
    },

    // REALIZA UN PROGRESS LOADIND A NIVEL DE RAÍZ
    ...mapMutations(["setLoading"]),

    //OBTENER EL ITEM DE OFICINA
    getOfficeFromData() {
      var formatStatus = "";
      if (this.editedItem.oficina.toUpperCase() === "GUAYAQUIL") {
        formatStatus = "GUAYAQUIL";
      } else if (this.editedItem.oficina.toUpperCase() === "QUITO") {
        formatStatus = "QUITO";
      }
      return formatStatus;
    },

    //AGREGAR NUEVO VALOR DE OFICINA
    setOfficeFromData(officeData) {
      if (officeData === "GUAYAQUIL") {
        this.editedItem.oficina = "GUAYAQUIL";
      } else if (officeData === "QUITO") {
        this.editedItem.oficina = "QUITO";
      }
    },

    //OBTENER EL ITEM DE ESTADO
    getStatusFromData() {
      var formatStatus = "";
      if (this.editedItem.status === "A") {
        formatStatus = "ACTIVO";
      } else if (this.editedItem.status === "D") {
        formatStatus = "INACTIVO";
      }
      return formatStatus;
    },

    //AGREGAR NUEVO VALOR DE STATUS
    setStatusFromData(statusData) {
      if (statusData === "ACTIVO") {
        this.editedItem.status = "A";
      } else if (statusData === "INACTIVO") {
        this.editedItem.status = "D";
      }
    },

    //FORMATO PARA EL DATE TEXT PICKER
    formatDate(date) {
      if (!date) return null;
      var parsedDate = new moment(date, moment.ISO_8601).format("DD/MM/YYYY");
      return parsedDate;
    },

    //FORMATO PARA EL CAMPO DE FECHA EN LA TABLA
    getFormatedDate(date) {
      if (!date) return null;
      var parsedDate = new moment(date, moment.ISO_8601).format(
        "DD/MM/YYYY HH:mm:ss A"
      );
      return parsedDate;
    },

    //ACCION DE EDITAR UN MERCADERISTA
    editItem(item) {
      this.editedIndex = this.pollsters.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    //ASIGNA UN MERCADERISTA PARA SER ELIMINADO
    deleteItem(item) {
      this.editedIndex = this.pollsters.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.eraseDialog = true;
    },

    // ELIMINA DE LA BASE DE DATOS AL MERCADERISTA
    async acceptDelete() {
      try {
        this.setLoading(true);
        const transactionData = {
          transaction: "D",
          pollster: this.editedItem,
        };
        await http.post(`/Branch/transactionPollster`, transactionData);
        this.pollsters.splice(this.editedIndex, 1);
      } catch (e) {
        this.showAlert = true;
        this.alertMessage = e;
      } finally {
        this.close("E");
        this.closeAlerts();
        this.setLoading(false);
      }
    },

    //REESTABLECER VALORES POR DEFECTO A LOS CAMPOS EDITADOS PERO RECHAZADOS
    close(type) {
      if (type === "P") {
        this.dialog = false;
        requestAnimationFrame(() => {
          this.$refs.observer.reset();
        });
      } else if (type === "E") {
        this.eraseDialog = false;
      }

      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
        this.date1 = new moment().format("YYYY-MM-DD");
        this.date2 = new moment().format("YYYY-MM-DD");
      });
    },

    //GUARDAR LOS CAMBIOS O EL NUEVO MERCADERISTA A LA LISTA
    async save() {
      var valid = this.$refs.observer.validate();
      if (!valid) return;
      try {
        this.setLoading(true);
        this.editedItem["idaccount"] = parseInt(this.getUserData.idAccount, 10);
        var type = "";
        if (this.editedIndex > -1) {
          //EDITAR ITEM
          type = "U";
        } else {
          //AÑADIR NUEVO
          type = "I";
        }
        const transactionData = {
          transaction: type,
          pollster: this.editedItem,
        };
        console.log(transactionData);
        await http.post(`/Branch/transactionPollster`, transactionData);
        this.getPollsters();
      } catch (e) {
        this.showAlert = true;
        this.alertMessage = e;
      } finally {
        this.close("P");
        this.closeAlerts();
        this.setLoading(false);
      }
    },
  },
  mounted() {
    //OBTENER LA LISTA DE MERCADERISTA
    this.getPollsters();
  },
};
</script>

<style>
.tText {
  color: #232365;
  font-weight: 500;
  letter-spacing: 1px;
}
.v-data-table > .v-data-table__wrapper > table > thead > tr > th {
  font-weight: bold;
  color: black;
  font-size: 11px;
}
.v-data-table > .v-data-table__wrapper > table > tbody > tr > td {
  font-weight: 400;
  font-size: 12px;
}
</style>
