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
              v-if="banderaxml"
            >
              <v-icon left>mdi-file-excel</v-icon>
              Formato Ingreso
            </v-btn>
     
          </v-card-title>
          <v-card-subtitle>
            <v-row class="pl-3 pr-5 pt-2 mr-5" v-if="banderaxml">
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
                        id="archivo"
                        v-model="file"
                        color="deep-purple accent-4"
                        counter
                        label="Archivo"
                        placeholder="Seleccione archivo a subir"
                        accept=".xls,.xlsx,.xml"
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
                            name="Tipo de Ingreso"
                            :items="campaignItems"
                            label="Tipo de Ingreso"
                            outlined
                            item-text="name"
                            :dense="true"
                            color="accent darken-1"
                            :menu-props="{ top: false, offsetY: true }"
                            :error-messages="errors"
                         
                          ></v-select>
                        </ValidationProvider>

                     
                        <v-row v-if="!banderaxml">
                          <v-col cols = "12" lg = "12" md = "12" sm = "12">
                            ({{itemsFactura}}) Total de items en factura
                            <v-progress-linear
                              buffer-value="100"
                              height="25"
                              :active="true"
                              v-if="!banderaxml"
                              :background-opacity="0.3"
                              color="blue"
                            >
                              <template>
                                <strong>{{ Math.ceil(knowledge) }}%</strong>
                              </template>
                            </v-progress-linear>
                          </v-col>
                          <v-col cols = "12" lg = "12" md = "12" sm = "12" 
                            style="text-align: center">
                            <v-btn
                              class="text-capitalize"
                              color="deep-purple accent-4"
                              :dark="true"
                              v-if="!banderaxml"
                              @click="verificar"
                            >
                              Iniciar Verificación
                            </v-btn>
                          </v-col>
                        </v-row>
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
                          @click="step3"
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
                              v-if="banderaxml"
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
        <h1 class="tText">Ingreso de Stock en Camiones </h1>
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
      
        </v-row>
      </v-col>
    </v-row>
    <v-row class="justify-lg-space-between">
      <v-col lg="5" cols="sm" class="pb-2">
        <v-card class="rounded-xl pa-3" rounded="true">
          <v-row class="align-baseline justify-space-between">
            <v-col cols="5" lg="4">
              <h3 class="tText pl-3">Camiones Activos</h3>
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
            :headers="headersRoute"
            :items="routeItems"
            item-key="id"
            class="elevation-0"
            light
            :fixed-header="true"
            :loading="loadingActiveRoutes"
            :search="searchQuery"
          >
            <template v-slot:[`item.status`]="{ item }">
              <div class="d-flex justify-center">
                <v-switch
                  v-model="item.status"
                  inset
                  dense
                  color="success"
                  @click="changeStateRoute(item)"
                ></v-switch>
              </div>
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                medium
                class="mr-2"
                :color="selectedRouteData === item ? 'accent' : 'gray'"
                @click="searchPollsters(item)"
              >
                mdi-account-multiple
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="info" dark @click="getCampaignStatus"
                >Reintentar</v-btn
              >
            </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col lg="7" cols="sm" class="pb-2">
        <v-card class="rounded-xl pa-3" rounded="true">
          <v-row class="align-baseline justify-space-between">
            <v-col cols="5" lg="4">
              <h3 class="tText pl-3">Stock por Vendedor</h3>
            </v-col>
            <v-col class="text-right mr-3" lg="7">
           
            </v-col>
          </v-row>
          <v-data-table
            :headers="headersPollsters"
            :items="pollstersItems"
            class="elevation-0"
            item-key="id"
            :loading="loadingPollstersInRoute"
            light
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon
                medium
                class="mr-2"
                color="error"
                @click="eraseDialog = true"
              >
                mdi-delete
              </v-icon>
              <v-dialog v-model="eraseDialog" persistent max-width="290">
                <v-card>
                  <v-card-title class="headline"
                    >Eliminar Encuestador</v-card-title
                  >
                  <v-card-text
                    >¿Está seguro de eliminar el encuestador? Una vez eliminado,
                    no se podrá deshacer.</v-card-text
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="deep-purple darken-4"
                      text
                      @click="eraseDialog = false"
                      >Cancelar</v-btn
                    >
                    <v-btn
                      color="deep-purple darken-4"
                      dark
                      @click="deletePollsterRoute(item)"
                      >Aceptar</v-btn
                    >
                  </v-card-actions>
                </v-card>
              </v-dialog>
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
    this.getCampaignStatus();

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
      eraseDialog: false,
      dialogAddPollster: false,
      loadingActiveRoutes: false,
      errorList: [],
      successList: [],
      lockFinishOptions: true,
      optionItems: ["Importar local", "Importar local y tareas"],
      campaignItems: [{name:"Carga Camion"},{name:"Devolucion"}],
      stateItems: [],
      selectOption: "Carga Camion",
      selectState: null,
      selectCampaign: null,
      errorDownloadLink: "",
      file: undefined,
      uploadData: null,
      selectedRouteData: null,
      loadingPollstersInRoute: false,
      banderaxml: true,
      knowledge: 0,
      itemsFactura: 0,
      itemsFacturaProcesar:null,
      erroresFactura:[],
      headersRoute: [
          {
          text: "ID",
          align: "left",
          sortable: false,
          value: "id",
        },
        {
          text: "Venddor",
          align: "left",
          sortable: false,
          value: "route",
        },
        { text: "Estado", value: "status", align: "center" },
        {
          text: "Inventario",
          value: "actions",
          sortable: false,
          align: "center",
        },
      ],
      headersPollsters: [
        {
          text: "Id",
          align: "left",
          sortable: false,
          value: "code",
        },
        { text: "Producto", value: "producto", align: "center" },
        { text: "Cantidad", value: "cantidad", align: "center" },
         { text: "Precio", value: "precio", align: "center" },
        
   
      ],
      headersActivePollsters: [
        {
          text: "IMEI",
          align: "left",
          sortable: false,
          value: "code",
        },
        { text: "NOMBRES", value: "name", align: "center" },
        { text: "CELULAR", value: "phone", align: "center" },
        { text: "OFICINA", value: "oficina", align: "center" },
        { text: "       ", value: "actions", sortable: false, align: "center" },
      ],
      headersAddToRoute: [
        {
          text: "IMEI",
          align: "center",
          sortable: false,
          value: "imei",
        },
        { text: "CELULAR", sortable: false, align: "center", value: "phone" },
      ],
      addToRouteItems: [],
      routeItems: [],
      pollstersItems: [],
      selectedToAddRoute: [],
      singleSelect: false,
      searchQueryPollster: "",
      loadAddToRoute: false,
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

    //Mostrar Dialogo subir xml
    showxml() {
      this.dialog = true;
      this.banderaxml = false;
    },
    //GET THE CURRENT POLLSTERS IN A ROUTE, BY CLICKING ONE
    async searchPollsters(itemRoute) {
      try {
        this.setLoading(true);
        this.loadingPollstersInRoute = true;

        var requestParams = {
          IdAccount: parseInt(this.getUserData.idAccount, 10),
          RouteCode: itemRoute.id.toString(),
        };
        const response = await http.post(
          `/Surti/ObtnerInventarioVenddoresActivos`,
          requestParams
        );

        if (response.status === "Ok") {
        this.selectedRouteData = itemRoute;
          this.pollstersItems = response.data;
        } else {
          throw response.messege;
        }
      } catch (e) {
        alert(e);
      } finally {
        this.loadingPollstersInRoute = false;
        this.setLoading(false);
      }
    },

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

    //GET CAMPAIGN DATA FOR FILE IMPORT
    async getCampaignStatus() {
      try {
        this.loadingActiveRoutes = true;
        var requestParams = {
          Iduser: this.getUserData.idUser,
          IdAccount: parseInt(this.getUserData.idAccount, 10),
        };

        const response = await http.post(`/Surti/ObtnerVenddoresActivos`, requestParams);
        if (response.status === "Ok") {
          this.routeItems = response.data;
        } else {
          throw response.messege;
        }
      } catch (dataError) {
        alert(dataError);
      } finally {
        this.loadingActiveRoutes = false;
      }
    },


  

    //GET THE FILE INPUT AND TRANSFORM IN AN JSON ARRAY
    parseFile(result) {
      try {
        console.log(result)
        this.loadingData = true;
        this.uploadData = null;
        var data = result;
        console.log("parseFile")
        var workbook = XLSX.read(data, {
          type: "binary",
        });
        console.log("workbook")
        console.log(workbook)
        let rowObject = XLSX.utils.sheet_to_row_object_array(
          workbook.Sheets["Formato"]
        );
        if (rowObject.length > 0) {
          let jsonObject = JSON.stringify(rowObject);
          var isValid = this.checkValidDocument(jsonObject);
          if (isValid) {
            var hasDuplicate = false;
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
        console.log("readFile");
        const utf8 = require('utf8');
        fileReader.readAsBinaryString(this.file);
        console.log(fileReader);
        
        if(this.banderaxml){
          fileReader.onload = (e) => this.parseFile(e.target.result);
          fileReader.onerror = () => alert("Error al cargar el archivo");
        }else{
          fileReader.onload = (e) => this.parseFilexml(utf8.decode(e.target.result));
          fileReader.onerror = () => alert("Error al cargar el archivo");
        }
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
      async uploadDataToServer(itemData, campaignId, optionId) {
      try {

        console.log(itemData);
           itemData.Cantidad= itemData.Cantidad.toString();
          itemData.Cedula = itemData.Cedula.toString();
          itemData.Nombre_Producto = itemData.Nombre_Producto.toString();
          itemData.Vendedor = itemData.Vendedor.toString();
          itemData.Id_Producto = itemData.Id_Producto.toString();
                } catch (error) {
          alert("Error en los formatos del archivo refresque la paguina y vuelva a cargar");
      }
      
      try {
        var uploadHeaderData = {
          account: parseInt(this.getUserData.idAccount, 13),
          iduser: this.getUserData.idUser,
          option: optionId,
          stockCamion: itemData,
        };
        const response = await http.post(`/Surti/LoadStock`, uploadHeaderData);
        if (response.status === "Error") {
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
          `/Surti/PrintErrorLoadTask`,
          this.errorList
        );
        this.errorDownloadLink = response.data;
      } catch (e) {
        alert("ERROR AL OBTENER ARCHIVO DE ERRORES");
      } finally {
        console.log("");
      }
    },
  //CALL A LOOP TO INSERT THE INFORMATION INTO SERVER

    //CHECK IF THE INPUT FILE GET THE CURRENT HEADERS
    checkValidDocument(data) {
      var json = JSON.parse(data);
     
      if (
        "Id_Producto" in json[0] &&
        "Nombre_Producto" in json[0] &&
        "Vendedor" in json[0] &&
        "Cedula" in json[0] &&
        "Cantidad" in json[0] 
     
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
            json[i]["Id_Producto"] === json[j]["Id_Producto"]
          ) {
            repeted = true;
            break;
          }
        }
        if (repeted) break;
      }
      return repeted;
    },

    step3(){
      if(this.banderaxml){
        this.insertData();
      }else{
        this.verificarSave();
        console.log(this.errorList)
      }
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
      console.log("backToSecond");
      console.log(this.file);
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
      this.selectOption = "Importar locales";
      this.selectCampaign = null;
      this.successList = [];
      this.resumeComplete = false;
    },

    //CLEAN ALL IMPORT DATA AND CLOSE DIALOG
    finishImport() {
      this.dialog = false;
      this.banderaxml = true;
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
