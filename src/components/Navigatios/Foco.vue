<template>
  <div class="pb-15">
    <v-dialog v-model="eraseDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">{{this.MessageCambioEstad}}</v-card-title>
        <v-card-text
          >¿Está seguro de cambiar de estado al producto?.</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="deep-purple darken-4" text @click="close('E')"
            >Cancelar</v-btn
          >
          <v-btn color="deep-purple darken-4" v-if="this.MessageCambioEstad=='Desactivar Producto'" dark @click="acceptDelete"
            >Aceptar</v-btn
          >
           <v-btn color="deep-purple darken-4" v-if="this.MessageCambioEstad=='Activar Producto'" dark @click="acceptActive"
            >Aceptar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-row justify="center">
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <h2 class="tText">Importar archivos</h2>
            <v-spacer />
            <v-btn
              class="pr-0 pl-0 ml-4 text-capitalize"
              text
              medium
              elevation="0"
              color="accent"
              href="../../assets/cargaLocales.xlsx"
              download="cargaLocales.xlsx"
            >
              <v-icon left>mdi-file-excel</v-icon>
              Formato
            </v-btn>
          </v-card-title>
          <v-card-subtitle>
            <v-row class="pl-3 pr-5 pt-2 mr-5">
              <h5 class="tText">Productos Foco</h5>
            </v-row>
          </v-card-subtitle>
          <v-card-text class="pa-0">
            <v-stepper v-model="step" class="elevation-0">
              <v-stepper-header class="elevation-0">
                <v-stepper-step :complete="step > 1" step="1" color="accent"
                  >Subir archivo</v-stepper-step
                >
                <v-divider></v-divider>

                <v-stepper-step
                  :complete="resumeComplete"
                  step="2"
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
                        @click="insertData"
                        :disabled="parsedState"
                      >
                        Continuar
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-stepper-content>

                <v-stepper-content step="2">
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
        <h1 class="tText">Administración de productos foco</h1>
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
            :disabled = "true"
          >
            <v-icon left>mdi-file-excel</v-icon>
            Importar
          </v-btn>
          <v-dialog v-model="dialogProduct" persistent max-width="600px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                class="ma-2 text-capitalize"
                medium
                elevation="1"
                color="#ffba69"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon left>mdi-plus</v-icon>
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
                          name="idfoco"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.idfoco"
                            name="idfoco"
                            label="Código*"
                            prepend-icon="mdi-barcode-scan"
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="nombre"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.nombre"
                            name="nombre"
                            label="NOMBRE*"
                            prepend-icon="mdi-folder"
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="descripcion"
                          rules="required"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.descripcion"
                            name="descripcion"
                            label="DESCRIPCION*"
                            prepend-icon="mdi mdi-message-text"
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <ValidationProvider
                          name="meta"
                          rules="required|numeric"
                          v-slot="{ errors }"
                        >
                          <v-text-field
                            v-model="editedItem.meta"
                            name="meta"
                            label="META*"
                            prepend-icon="mdi-counter"
                            required
                            color="accent darken-1"
                            :error-messages="errors"
                          ></v-text-field>
                        </ValidationProvider>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <v-select
                          v-model="editedItem.estado"
                          :items="[{state:'Activo',abbr:'A'},{state:'Inactivo',abbr:'I'}]"
                          label="ESTADO*"
                          item-text="state"
                          item-value="abbr"
                          prepend-icon="mdi-book-remove-multiple"
                          required
                          color="accent darken-1"
                          :menu-props="{ top: false, offsetY: true }"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="6" class="pt-0 pb-0">
                        <v-combobox
                          v-model="editedItem.idArticulo"
                          :items="listaCmbProductos"
                          label="Selecione Productos*"
                          item-text="label"
                          item-value="value"
                          prepend-icon="mdi-book-remove-multiple"
                          required
                          multiple
                          chips
                          color="accent darken-1"
                          :menu-props="{ top: false, offsetY: true }"
                        >   
                          <template v-slot:selection="data">
                              {{ data.item.value }}
                          </template>
                        </v-combobox>
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
          <v-row class="align-baseline justify-space-between">
            <v-col cols="5" lg="4">
              <h3 class="tText pl-3">Productos Foco</h3>
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
            :headers="headersProduct"
            :items="productItems"
            item-key="id"
            class="elevation-0"
            light
            :fixed-header="true"
            :loading="loadingProducts"
            :search="searchQuery"
          >
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small color="accent" class="mr-2" @click="editItem(item)">
                mdi-pencil
              </v-icon>
              <v-icon small color="success" v-if="item.estado=='A'" @click="deleteItem(item)">
                mdi-marker-check
              </v-icon>
               <v-icon  color="error" v-if="item.estado=='I'" @click="ActivarItem(item)">
                mdi-bookmark-remove
              </v-icon>
            </template>
            <template v-slot:no-data>
              <v-btn color="info" dark 
                >Reintentar</v-btn
              >
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
    this.getProductsFoco();
    this.getCmbProductos();
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
      loadingProducts: false,
      errorList: [],
      successList: [],
      lockFinishOptions: true,
      errorDownloadLink: "",
      file: undefined,
      uploadData: null,
      MessageCambioEstad:"Eliminar Producto",
      headersProduct: [
        {
          text: "CODIGO",
          align: "left",
          sortable: false,
          value: "idfoco",
        },
        {
          text: "NOMBRE",
          align: "left",
          sortable: true,
          value: "nombre",
        },
        { text: "DESCRIPCION", value: "descripcion", align: "start", sortable: true },
        {
          text: "META",
          value: "meta",
          sortable: true,
          align: "center",
        },
        {
          text: "ESTADO",
          value: "estado",
          sortable: true,
          align: "center",
        },
        {
          text: "ACCIONES",
          value: "actions",
          align: "center",
          sortable: false,
        },
      ],
      listaCmbProductos:[],
      productItems: [],
      productsAccount: [],
      dialogProduct: false,
      eraseDialog: false,
      editedItem: {
        idfoco: 0,
        nombre: "",
        descripcion: "",
        meta: 0,
        estado: "",
        idArticulo:[],

      },
      defaultItem: {
        idfoco: 0,
        nombre: "",
        descripcion: "",
        meta: 0,
        estado: "",
        idArticulo:[],
      },
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

    //GET TITLE IF IS NEW OR UPDATE
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo Producto" : "Editar Producto";
    },

    //CHECK IF THE FILE IS READY TO UPLOAD
    fileInput() {
      return this.file === undefined;
    },

    //CHECK IF A STATE ROUTE IS CHOISED
    parsedState() {
      return this.uploadData === null;
    },
  },
  methods: {
    // REALIZA UN PROGRESS LOADIND A NIVEL DE RAÍZ
    ...mapMutations(["setLoading"]),

    //GET CAMPAIGN DATA FOR FILE IMPORT
    async getCmbProductos () {
      this.loadingProducts = true;
      var idAcc = parseInt(this.getUserData.idAccount, 10);
      const response = await http.get(`/Order/Products?idAccount=${idAcc}`);
      
      try{
      if (response.status === "Ok") {
          var data = response.data;
          // console.log("llegaron los productos");
          // console.log(data);

          data.forEach(element => {
            var item = {
              value:element.codigo,
              label:element.sku,
            }
            this.listaCmbProductos.push(item);
          });
        } else {
          throw response.messege;
        }
      } catch (dataError) {
        alert(dataError);
      } finally {
        this.loadingProducts = false;
      }
    },

    async getProductsFoco() {
      try {
        this.loadingProducts = true;
        var idAcc = parseInt(this.getUserData.idAccount, 10);
        

        const response = await http.get(`/Order/getFocos?Idaccount=${idAcc}`);
        if (response.status === "Ok") {
          this.productItems = response.data;
          
          console.log("llegaron los Focos");
          console.log(this.productItems);


          if(this.productItems){
            this.productItems.forEach(foco=>{
              var cbxProductos = [];
              if(foco.idArticulo){
                 foco.idArticulo.forEach(item=>{
                  var cbxProducto = {
                    value: item,
                    label: item
                  }
                  cbxProductos.push(cbxProducto);
                });
                foco.idArticulo = cbxProductos;
              }
            });
          }

        } else {
          throw response.messege;
        }
      } catch (dataError) {
        alert(dataError);
      } finally {
        this.loadingProducts = false;
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
        let rowObject = XLSX.utils.sheet_to_json(workbook.Sheets["Formato"], {
          raw: true,
        });
        if (rowObject.length > 0) {
          let jsonObject = JSON.stringify(rowObject);
          var isValid = this.checkValidDocument(jsonObject);
          if (isValid) {
            var hasDuplicate = this.checkForDuplicate(jsonObject);
            if (!hasDuplicate) {
              this.uploadData = this.documentToString(jsonObject);
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

    documentToString(data) {
      var jsonData = JSON.parse(data);
      const formated = jsonData.map(function(x) {
        x["Codigo"] = "" + x["Codigo"];
        x["Sku"] = "" + x["Sku"];
        x["IVA"] = "" + x["IVA"];
        x["Impuesto_interno"] = "" + x["Impuesto_interno"];
        x["Cantidad"] = "" + x["Cantidad"];
        x["Precio"] = "" + x["Precio"];
        return x;
      });

      return formated;
    },

    //CHECK IF THE INPUT FILE GET THE CURRENT HEADERS
    checkValidDocument(data) {
      var json = JSON.parse(data);

      if (
        "Codigo" in json[0] &&
        "Sku" in json[0] &&
        "IVA" in json[0] &&
        "Impuesto_interno" in json[0] &&
        "Cantidad" in json[0] &&
        "Precio" in json[0]
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
          if (i !== j && json[i]["Codigo"] === json[j]["Codigo"]) {
            repeted = true;
            break;
          }
        }
        if (repeted) break;
      }
      return repeted;
    },

    //SET THE CURRENT PRODUCT TO BE EDITED
    editItem(item) {
      this.editedIndex = this.productItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      console.log(this.editedItem);
      this.dialogProduct = true;
    },

    //SET THE CURRENT PRODUCT TO BE DELETED
    deleteItem(item) {
      this.editedIndex = this.productItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.MessageCambioEstad="Desactivar Producto"
      this.eraseDialog = true;
    },
      ActivarItem(item) {
      this.editedIndex = this.productItems.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.MessageCambioEstad="Activar Producto"
      this.eraseDialog = true;
    },
    //SET DEFAULT ITEMS TO EMPTY DATA BY TYPE
    close(type) {
      if (type === "P") {
        this.dialogProduct = false;
        requestAnimationFrame(() => {
          this.$refs.observer.reset();
        });
      } else if (type === "E") {
        this.eraseDialog = false;
      }
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    //GUARDAR LOS CAMBIOS O EL NUEVO MERCADERISTA A LA LISTA
    async save() {
      var valid = this.$refs.observer.validate();
      if (!valid) return;
      try {
        this.setLoading(true);
        this.editedItem["idaccount"] = parseInt(this.getUserData.idAccount, 10);
        this.editedItem["meta"] = Number(this.editedItem["meta"]);
        this.editedItem["idfoco"] = Number(this.editedItem["idfoco"]);
        console.log(this.editedItem);
        var type = "";
        if (this.editedIndex > -1) {
          //EDITAR ITEM
          type = "U";
        } else {
          //AÑADIR NUEVO
          type = "I";
        }

        var stringProductos = [];
        if(this.editedItem){
            if(this.editedItem.idArticulo){
                this.editedItem.idArticulo.forEach(item=>{
                stringProductos.push(item.value);
              });
              this.editedItem.idArticulo = stringProductos;
            }
        }

        const transactionData = {
          transaction: type,
          foco: this.editedItem,
        };
        console.log(transactionData)
        await http.post(`/Order/transactionFoco`, transactionData);
        this.getProductsFoco();
      } catch (e) {
        alert(e);
      } finally {
        this.close("P");
        this.setLoading(false);
      }
    },

    // ONLY DISABLE THE CURRENT PRODUCT FROM DATABASE
    async acceptDelete() {
      try {

        this.setLoading(true);
        this.loadingProducts = true;
        await http.post(`/Order/ActiveFoco?idfoco=${this.editedItem.idfoco}`);
        this.productItems.find(x=>x.idfoco==this.editedItem.idfoco).estado='I';
        this.productItems.splice(this.productItems.find(x=>x.idfoco==this.editedItem.idfoco),1);
      } catch (e) {
        alert(e);
      } finally {
        this.close("E");
        this.loadingProducts = false;
        this.setLoading(false);
      }
    },
 // ONLY DISABLE THE CURRENT PRODUCT FROM DATABASE
    async acceptActive() {
      try {
        this.setLoading(true);
        this.loadingProducts = true;
        await http.post(`/Order/ActiveFoco?idfoco=${this.editedItem.idfoco}`);
         this.productItems.find(x=>x.idfoco==this.editedItem.idfoco).estado='A';
      } catch (e) {
        alert(e);
      } finally {
        this.close("E");
        this.loadingProducts = false;
        this.setLoading(false);
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

    //UPLOAD EACH ARRAY ITEM FILE IMPORT TO SERVER
    async uploadDataToServer(itemData) {
      try {
        itemData["Idaccount"] = parseInt(this.getUserData.idAccount, 10);
        const response = await http.post(`/Order/SaveExcelProduct`, itemData);
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
          `/Order/PrintErrorProduct`,
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
    insertData() {
      this.lockFinishOptions = true;
      this.step = 2;
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
        this.resumeComplete = true;
      }, 630);
    },

    //CLEAN ALL STEPS CHOISES AND GO BACK TO FIRST STEP
    resetImport() {
      this.clearImportData();
      this.step = 1;
    },

    //CLEAN ALL IMPORT DATA
    clearImportData() {
      this.file = undefined;
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
