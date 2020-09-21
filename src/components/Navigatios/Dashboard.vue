<template>
  <div class="pb-15">
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <h2 class="tText">Importar archivos</h2>
            <v-spacer />
            <v-btn
              class="pr-0 pl-0 text-capitalize"
              text
              medium
              elevation="0"
              color="success"
              href="../../assets/cargaTareas.xlsx"
              download="cargaTareas.xlsx"
            >
              <v-icon left>mdi-file-excel</v-icon>
              Tareas
            </v-btn>
            <v-btn
              class="pr-0 pl-0 ml-4 text-capitalize"
              text
              medium
              elevation="0"
              color="success"
              href="../../assets/cargaLocales.xlsx"
              download="cargaLocales.xlsx"
            >
              <v-icon left>mdi-file-excel</v-icon>
              Local
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            <v-row class="pl-3 pr-5 pt-2 mr-5">
              <h5 class="tText">Productos</h5>
              <v-spacer />
              <h5 class="tText">Formatos</h5>
            </v-row>
          </v-card-subtitle>
          <v-card-text class="pa-0">
            <v-stepper v-model="step" class="elevation-0">
              <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="step > 1" step="1" color="accent"
                  >Subir archivo</v-stepper-step
                >
                <v-divider></v-divider>
                <v-stepper-step :complete="step > 2" step="2" color="accent"
                  >Escoger opciones</v-stepper-step
                >
                <v-divider></v-divider>
                <v-stepper-step
                  :complete="resumeComplete"
                  step="3"
                  color="accent"
                  >Resumen</v-stepper-step
                >
              </v-stepper-header>
              <v-stepper-items>
                <v-stepper-content step="1">
                  <v-card class="mb-2 elevation-0" height="300px">
                    <v-card-text>
                      <v-file-input
                        v-model="file"
                        color="deep-purple accent-4"
                        counter
                        label="Archivo"
                        placeholder="Seleccione archivo a subir"
                        accept=".xls,.xlsx"
                        prepend-icon=""
                        outlined
                        height="120px"
                        :show-size="1000"
                      >
                        <template v-slot:selection="{ index, text }">
                          <v-row class="justify-center">
                            <v-chip
                              v-if="index < 2"
                              color="deep-purple accent-4"
                              dark
                              label
                              small
                            >
                              {{ text }}
                            </v-chip>
                          </v-row>
                        </template>
                      </v-file-input>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                      <v-btn
                        class="ml-2 text-capitalize"
                        color="deep-purple accent-4"
                        :loading="loadingData"
                        text
                        :dark="!fileInput && !lockUp"
                        @click="readFile"
                        :disabled="fileInput || lockUp"
                        >Subir</v-btn
                      >
                      <v-btn
                        class="text-capitalize"
                        color="deep-purple accent-4"
                        :dark="!parsedState"
                        @click="backToSecond"
                        :disabled="parsedState"
                      >
                        Continuar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <ValidationObserver ref="obs" v-slot="{ invalid, validated }">
                    <v-card class="mb-2 elevation-0" height="300px">
                      <v-card-text>
                        <ValidationProvider
                          name="campaña"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-select
                            v-model="selectCampaign"
                            name="campaña"
                            :items="['GUAYAQUIL', 'QUITO']"
                            label="Campañas"
                            outlined
                            :dense="true"
                            color="accent darken-1"
                            :menu-props="{ top: false, offsetY: true }"
                            :error-messages="errors"
                          ></v-select>
                        </ValidationProvider>

                        <v-select
                          class="pt-1"
                          v-model="computedOption"
                          :items="optionItems"
                          label="Opción"
                          color="accent darken-1"
                          outlined
                          :dense="true"
                          :menu-props="{ top: false, offsetY: true }"
                        ></v-select>
                        <ValidationProvider
                          name="estado"
                          rules="required"
                          v-slot="{ errors }"
                          v-if="showState"
                        >
                          <v-select
                            class="pt-1"
                            v-model="selectState"
                            name="estado"
                            :items="stateItems"
                            label="Estado de tareas"
                            outlined
                            :dense="true"
                            color="accent darken-1"
                            :menu-props="{ top: false, offsetY: true }"
                            :error-messages="errors"
                          ></v-select>
                        </ValidationProvider>
                      </v-card-text>
                      <v-card-actions class="justify-center">
                        <v-btn
                          class="ml-2 text-capitalize"
                          text
                          @click="step = 1"
                          >Volver</v-btn
                        >
                        <v-btn
                          class="text-capitalize"
                          color="deep-purple accent-4"
                          :dark="!invalid && validated"
                          @click="insertData"
                          :disabled="invalid || !validated"
                        >
                          Continuar
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </ValidationObserver>
                </v-stepper-content>

                <v-stepper-content step="3">
                  <v-card
                    class="background mb-2 elevation-0"
                    color="grey lighten-1"
                    height="300px"
                  >
                    <v-card-text class="pt-0">
                      <v-row>
                        <v-col class="elevation-1" cols="12" sm="6" md="6">
                          <v-container>
                            <h4>Datos Cargados</h4>
                            <v-progress-linear
                              v-if="uploadData !== null"
                              :active="true"
                              :background-opacity="0.3"
                              :buffer-value="100"
                              :height="15"
                              :value="
                                (successList.length * 100) / uploadData.length
                              "
                              color="success"
                            >
                              <template>
                                <strong>{{ successList.length }}</strong>
                              </template>
                            </v-progress-linear>
                          </v-container>
                          <v-container>
                            <h4>Errores</h4>
                            <v-progress-linear
                              v-if="uploadData !== null"
                              :active="true"
                              :background-opacity="0.3"
                              :buffer-value="100"
                              :height="15"
                              :value="
                                (errorList.length * 100) / uploadData.length
                              "
                              color="error"
                            >
                              <template>
                                <strong>{{ errorList.length }}</strong>
                              </template>
                            </v-progress-linear>
                          </v-container>
                        </v-col>
                        <v-col
                          class="align-self-center"
                          cols="12"
                          sm="6"
                          md="6"
                        >
                          <v-container class="text-center">
                            <v-btn
                              class="ma-2 text-capitalize"
                              medium
                              elevation="1"
                              color="error"
                              :href="errorDownloadLink"
                              download="Acme Documentation (ver. 2.0.1).txt"
                              :disabled="errorList.length <= 0"
                            >
                              <v-icon left>mdi-file-excel</v-icon>
                              Errores
                            </v-btn>
                          </v-container>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions class="justify-center">
                      <v-btn
                        class="ml-2 text-capitalize"
                        text
                        @click="resetImport"
                        :disabled="lockFinishOptions"
                        >Importar Nuevo</v-btn
                      >
                      <v-btn
                        class="text-capitalize"
                        color="deep-purple accent-4"
                        :dark="!lockFinishOptions"
                        :disabled="lockFinishOptions"
                        @click="finishImport"
                      >
                        Terminar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              class="mr-4 mb-3 text-capitalize"
              color="error"
              text
              @click="finishImport"
              >Salir</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>

    <v-row>
      <v-col>
        <h1 class="tText">Control Rutas</h1>
      </v-col>
      <v-col class="align-self-center">
        <v-row class="justify-end">
          <v-btn
            class="ma-2 text-capitalize"
            medium
            elevation="1"
            light
            color="secondary-text"
            @click="dialog = !dialog"
          >
            <v-icon left>mdi-file-excel</v-icon>
            Importar
          </v-btn>
          <v-btn
            class="ma-2 text-capitalize"
            medium
            to="DashBoard/Pollsters"
            elevation="1"
            color="#ffba69"
          >
            <v-icon left>mdi-account-group</v-icon>
            Mercaderistas
          </v-btn>
        </v-row>
      </v-col>
    </v-row>
    <v-row class="justify-lg-space-between">
      <v-col lg="5" cols="sm" class="pb-2">
        <v-card class="rounded-xl pa-3" rounded="true">
          <v-row class="align-baseline">
            <v-col cols="5" lg="4">
              <h3 class="tText">Rutas Activas</h3>
            </v-col>
            <v-col class="text-top" lg="8">
              <v-text-field
                v-model="searchQuery"
                dense
                append-icon="mdi-magnify"
                placeholder="Buscar"
                outlined
                color="cyan"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="reportItems"
            item-key="id"
            class="elevation-1"
            light
            :search="searchQuery"
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.sales }}</td>
                <td>{{ item.customers }}</td>
                <td>{{ item.items }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col lg="7" cols="sm" class="pb-2">
        <v-card class="rounded-xl pa-3" rounded="true">
          <h3 class="tText pb-3 mt-4 mb-4">Encuestadores</h3>
          <v-data-table
            :headers="headers"
            :items="reportItems"
            class="elevation-1"
            item-key="id"
            light
          >
            <template v-slot:item="{ item }">
              <tr>
                <td>{{ item.name }}</td>
                <td>{{ item.sales }}</td>
                <td>{{ item.customers }}</td>
                <td>{{ item.items }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import XLSX from "xlsx";
import { ValidationProvider, ValidationObserver } from "vee-validate";
import { http } from "@/plugins/axios";

var fileReader = new FileReader();

export default {
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  data() {
    return {
      dialog: false,
      step: 1,
      resumeComplete: false,
      searchQuery: "",
      file: undefined,
      loadingData: false,
      uploadData: null,
      lockUp: false,
      showState: false,
      selectOption: "Importar local",
      selectState: "",
      selectCampaign: "",
      errorList: [],
      successList: [],
      optionItems: ["Importar local", "Importar local y tareas"],
      errorDownloadLink: "",
      lockFinishOptions: true,
      stateItems: [
        "Visitas",
        "Efectivas",
        "Anulado Campo",
        "Revisado Campo",
        "Revisado Validación",
        "Pendiente Validación",
        "Anulado Validación",
        "Editado",
        "Incidencia",
        "Pendiente Edición",
        "Anulado Edición",
      ],
      headers: [
        {
          text: "Product",
          align: "left",
          sortable: false,
          value: "name",
        },
        { text: "Sales", value: "sales" },
        { text: "Customers", value: "customers" },
        { text: "Items", value: "items" },
      ],
      reportItems: [
        {
          id: 1,
          name: "N95 Mask",
          sales: 2062,
          customers: 102,
          items: 8029,
          available: null,
        },
      ],
    };
  },
  watch: {
    file(newVal) {
      if (newVal === undefined) {
        this.uploadData = null;
        this.lockUp = false;
      }
    },
  },
  computed: {
    ...mapGetters(["getUserData"]),

    fileInput() {
      return this.file === undefined;
    },
    parsedState() {
      return this.uploadData === null;
    },

    computedOption: {
      get() {
        return this.getOption();
      },
      set(newValue) {
        this.setOption(newValue);
      },
    },
  },
  methods: {
    // REALIZA UN PROGRESS LOADIND A NIVEL DE RAÍZ
    ...mapMutations(["setLoading"]),

    getOption() {
      return this.selectOption;
    },

    setOption(value) {
      if (value !== "Importar local") {
        this.selectState = "";
        this.showState = true;
      } else {
        this.showState = false;
      }
      this.selectOption = value;
    },

    parseFile(result) {
      try {
        this.loadingData = true;
        this.uploadData = null;
        var data = result;
        var workbook = XLSX.read(data, {
          type: "binary",
        });
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets["Formato"]
        );
        if (rowObject.length > 0) {
          let jsonObject = JSON.stringify(rowObject);
          var isValid = this.checkValidDocument(jsonObject);
          if (isValid) {
            var hasDuplicate = this.checkForDuplicate(jsonObject);
            if (!hasDuplicate) {
              this.uploadData = JSON.parse(jsonObject);
              this.lockUp = true;
            } else {
              alert("EL DOCUMENTO CONTIENE DATOS DUPLICADOS");
            }
          } else {
            alert("DOCUMENTO NO VALIDO, REVISE EL FORMATO ADECUADO");
          }
        } else {
          alert("DOCUMENTO NO VALIDO, REVISE EL FORMATO ADECUADO");
        }
        this.loadingData = false;
      } catch (e) {
        console.log(e);
      }
    },

    readFile() {
      if (this.file) {
        fileReader.readAsBinaryString(this.file);
        fileReader.onload = (e) => this.parseFile(e.target.result);
        fileReader.onerror = () => alert("Error al cargar el archivo");
      }
    },

    async uploadDataToServer(itemData) {
      try {
        var uploadHeaderData = {
          account: parseInt(this.getUserData.idAccount, 10),
          iduser: this.getUserData.idUser,
          option: 1,
          _route: itemData,
        };
        const response = await http.post(`/Branch/LoadTask`, uploadHeaderData);
        console.log(response);
        if (response.status === "error") {
          throw response.data;
        }
        this.successList.push(itemData);
      } catch (dataError) {
        this.errorList.push(dataError);
      } finally {
        console.log("");
      }
    },

    async getErrorDocument() {
      try {
        console.log(this.errorList);
        const response = await http.post(
          `/Branch/PrintErrorLoadTask`,
          this.errorList
        );
        console.log(response);
        this.errorDownloadLink = response.data;
      } catch (e) {
        alert("ERROR AL OBTENER ARCHIVO DE ERRORES");
      } finally {
        console.log("");
      }
    },

    checkValidDocument(data) {
      var json = JSON.parse(data);

      if (
        "Codigo_Encuesta" in json[0] &&
        "PT_indice" in json[0] &&
        "Tipo" in json[0] &&
        "local" in json[0] &&
        "Dirección" in json[0] &&
        "Referencia" in json[0] &&
        "Nombres" in json[0] &&
        "Apellidos" in json[0] &&
        "Mail" in json[0] &&
        "Cédula" in json[0] &&
        "Celular" in json[0] &&
        "Telefono" in json[0] &&
        "Latitud" in json[0] &&
        "Longitud" in json[0] &&
        "Provincia" in json[0] &&
        "Canton" in json[0] &&
        "Parroquia" in json[0] &&
        "Estado" in json[0] &&
        "CLUSTER" in json[0] &&
        "RUTA" in json[0] &&
        "IMEI" in json[0]
      ) {
        return true;
      } else {
        return false;
      }
    },

    checkForDuplicate(data) {
      var json = JSON.parse(data);
      var repeted = false;
      for (var i = 0, len = json.length; i < len; i++) {
        for (var j = 0, lenCopy = json.length; j < lenCopy; j++) {
          if (
            i !== j &&
            json[i]["Codigo_Encuesta"] === json[j]["Codigo_Encuesta"]
          ) {
            repeted = true;
            break;
          }
        }
        if (repeted) break;
      }
      return repeted;
    },

    insertData() {
      this.lockFinishOptions = true;
      this.step = 3;
      setTimeout(async () => {
        this.setLoading(true);

        for (var i = 0, len = this.uploadData.length; i < len; i++) {
          await this.uploadDataToServer(this.uploadData[i]);
        }

        if (this.errorList.length > 0) {
          await this.getErrorDocument();
        }

        this.setLoading(false);
        this.lockFinishOptions = false;
      }, 630);
    },

    backToSecond() {
      this.step = 2;
      this.$refs.obs.reset();
      this.selectCampaign = "";
    },

    resetImport() {
      this.clearImportData();
      this.step = 1;
    },

    clearImportData() {
      this.file = undefined;
      this.$refs.obs.reset();
      this.selectState = "";
      this.selectCampaign = "";
      this.errorList = [];
      this.successList = [];
    },

    finishImport() {
      this.dialog = false;
      this.resetImport();
    },
  },
};
</script>

<style scoped>
.tText {
  color: #232365;
  font-weight: 500;
  letter-spacing: 1px;
}
</style>
