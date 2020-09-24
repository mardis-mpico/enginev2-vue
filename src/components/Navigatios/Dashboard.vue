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
                            v-model="computedCampaign"
                            name="campaña"
                            :items="campaignItems"
                            label="Campañas"
                            outlined
                            item-text="name"
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
                            v-model="computedState"
                            name="estado"
                            :items="stateItems"
                            label="Estado de tareas"
                            outlined
                            item-text="name"
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
          <v-row class="align-baseline justify-space-between">
            <v-col cols="5" lg="4">
              <h3 class="tText pl-3">Rutas Activas</h3>
            </v-col>
            <v-col class="text-top pr-3" lg="7">
              <v-text-field
                v-model="searchQuery"
                dense
                append-icon="mdi-magnify"
                placeholder="Buscar"
                outlined
                color="accent"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-data-table
            :headers="headers"
            :items="reportItems"
            item-key="id"
            class="elevation-0"
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
          <h3 class="tText pb-3 mt-4 mb-4 pl-3">Encuestadores</h3>
          <v-data-table
            :headers="headers"
            :items="reportItems"
            class="elevation-0"
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
  //VALIDATE COMPONENTS FOR INPUT VALUES
  components: {
    ValidationProvider,
    ValidationObserver,
  },
  //GET NECESARY INFO FROM SERVER
  created() {
    this.getCampaignInServer();
    this.getStatesInServer();
  },
  // SET DEFAULT VARIABLES TO MANAGE THE INFORMATION
  data() {
    return {
      step: 1,
      dialog: false,
      searchQuery: "",
      resumeComplete: false,
      loadingData: false,
      lockUp: false,
      showState: false,
      errorList: [],
      successList: [],
      lockFinishOptions: true,
      optionItems: ["Importar local", "Importar local y tareas"],
      campaignItems: [],
      stateItems: [],
      selectOption: "Importar local",
      selectState: null,
      selectCampaign: null,
      errorDownloadLink: "",
      file: undefined,
      uploadData: null,
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
  // OBSERVER FOR FILE IMPORT DATA
  watch: {
    file(newVal) {
      if (newVal === undefined) {
        this.uploadData = null;
        this.lockUp = false;
      }
    },
  },
  computed: {
    //GET DATA FROM USER STORE
    ...mapGetters(["getUserData"]),

    //CHECK IF THE FILE IS READY TO UPLOAD
    fileInput() {
      return this.file === undefined;
    },

    //CHECK IF A STATE ROUTE IS CHOISED
    parsedState() {
      return this.uploadData === null;
    },

    //TRANSFORM OPTION TO HIDE OR SHOW STATUS ROUTE
    computedOption: {
      get() {
        return this.selectOption;
      },
      set(newValue) {
        this.setOption(newValue);
      },
    },

    //TRANSFORM THE SELECT CAMPAIGN INTO A VALID DATA
    computedCampaign: {
      get() {
        return this.selectCampaign === null ? "" : this.selectCampaign;
      },
      set(newValue) {
        this.selectCampaign = newValue;
      },
    },

    //TRANSFORM ROUTE STATE TO VALID DATA
    computedState: {
      get() {
        return this.selectState === null ? "" : this.selectState;
      },
      set(newValue) {
        this.selectState = newValue;
      },
    },
  },
  methods: {
    // REALIZA UN PROGRESS LOADIND A NIVEL DE RAÍZ
    ...mapMutations(["setLoading"]),

    //SHOW OR HIDE ROUTE STATUS INPUT FIELD
    setOption(value) {
      if (value !== "Importar local") {
        this.selectState = "";
        this.showState = true;
      } else {
        this.showState = false;
      }
      this.selectOption = value;
    },

    //GET CAMPAIGN INFORMATION FOR A CURRENT USER
    async getCampaignInServer() {
      try {
        var requestParams = {
          Iduser: this.getUserData.idUser,
          IdAccount: parseInt(this.getUserData.idAccount, 10),
        };

        const response = await http.post(
          `/Branch/RouteCampaign`,
          requestParams
        );
        if (response.status === "Ok") {
          this.campaignItems = response.data;
        } else {
          throw response.messege;
        }
      } catch (dataError) {
        alert(dataError);
      } finally {
        console.log("");
      }
    },

    //GET ROUTE STATES FOR A CURRENT USER
    async getStatesInServer() {
      try {
        var requestParams = {
          Iduser: this.getUserData.idUser,
          IdAccount: parseInt(this.getUserData.idAccount, 10),
        };
        const response = await http.post(`/Branch/RouteStatus`, requestParams);
        if (response.status === "Ok") {
          this.stateItems = response.data;
        } else {
          throw response.messege;
        }
      } catch (dataError) {
        alert(dataError);
      } finally {
        console.log("");
      }
    },

    //GET THE FILE INPUT AND TRANSFORM IN AN JSON ARRAY
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

    //PREPARE FILE TO BE PARSED AND UPLOAD
    readFile() {
      if (this.file) {
        fileReader.readAsBinaryString(this.file);
        fileReader.onload = (e) => this.parseFile(e.target.result);
        fileReader.onerror = () => alert("Error al cargar el archivo");
      }
    },

    //SEARCH THE OBJECT ASSOCIATED TO THE CURRENT CAMPAIGN
    getCampaingIdFromObject() {
      var campaignSelectObject = this.campaignItems.filter(
        (element) => element.name === this.selectCampaign
      );

      return campaignSelectObject.length > 0 ? campaignSelectObject[0].id : 0;
    },

    //SEARCH THE OBJECT ASSOCIATED TO THE CURRENT STATE ROUTE
    getStatusIdFromObjct() {
      var stateSelectObject = this.stateItems.filter(
        (element) => element.name === this.selectState
      );
      return stateSelectObject.length > 0 ? stateSelectObject[0].id : 0;
    },

    //GET THE ID FROM THE CURRENT OPTION
    getOptionIdFromString() {
      if (this.selectOption === "Importar local") {
        return 1;
      } else if (this.selectOption === "Importar local y tareas") {
        return 2;
      }
    },

    //UPLOAD EACH ARRAY ITEM FILE IMPORT TO SERVER
    async uploadDataToServer(itemData, campaignId, optionId, statusId) {
      try {
        var uploadHeaderData = {
          account: parseInt(this.getUserData.idAccount, 10),
          iduser: this.getUserData.idUser,
          option: optionId,
          campaign: campaignId,
          status: statusId,
          _route: itemData,
        };
        console.log(uploadHeaderData);
        const response = await http.post(`/Branch/LoadTask`, uploadHeaderData);
        if (response.status === "error") {
          throw response;
        }
        this.successList.push(itemData);
      } catch (dataError) {
        if ("status" in dataError && "data" in dataError) {
          this.errorList.push(dataError.data);
        }
      } finally {
        console.log("");
      }
    },

    //IF ERRORS TO UPLOAD FILE ITEMS, GET A DOCUMENT
    async getErrorDocument() {
      try {
        const response = await http.post(
          `/Branch/PrintErrorLoadTask`,
          this.errorList
        );
        this.errorDownloadLink = response.data;
      } catch (e) {
        alert("ERROR AL OBTENER ARCHIVO DE ERRORES");
      } finally {
        console.log("");
      }
    },

    //CHECK IF THE INPUT FILE GET THE CURRENT HEADERS
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

    //IF DUPLICATE DATA EXIST, THE FILE INPUT IS REJECTED
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

    //CALL A LOOP TO INSERT THE INFORMATION INTO SERVER
    insertData() {
      this.lockFinishOptions = true;
      this.step = 3;
      setTimeout(async () => {
        this.setLoading(true);
        var campaignId = this.getCampaingIdFromObject();
        var optionId = this.getOptionIdFromString();
        var statusId = this.getStatusIdFromObjct();
        for (var i = 0, len = this.uploadData.length; i < len; i++) {
          await this.uploadDataToServer(
            this.uploadData[i],
            campaignId,
            optionId,
            statusId
          );
        }

        if (this.errorList.length > 0) {
          await this.getErrorDocument();
        }
        this.setLoading(false);
        this.lockFinishOptions = false;
        this.resumeComplete = true;
      }, 630);
    },

    //CLEAN SECOND STEP CHOICES
    backToSecond() {
      this.step = 2;
      this.$refs.obs.reset();
      this.selectCampaign = null;
      this.selectState = null;
    },

    //CLEAN ALL STEPS CHOISES AND GO BACK TO FIRST STEP
    resetImport() {
      this.clearImportData();
      this.step = 1;
    },

    //CLEAN ALL IMPORT DATA
    clearImportData() {
      this.file = undefined;
      this.$refs.obs.reset();
      this.selectState = null;
      this.selectOption = "Importar local";
      this.selectCampaign = null;
      this.successList = [];
      this.resumeComplete = false;
    },

    //CLEAN ALL IMPORT DATA AND CLOSE DIALOG
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
