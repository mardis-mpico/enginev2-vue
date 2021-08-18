<template>
  <div>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      color="deep-purple accent-4"
      elevation="24"
      bottom
      right
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" text v-bind="attrs" @click="snackbar = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-flex text-xs-center>
      <editable-map
        ref="mapRef"
        :zoom="zoom"
        :center="center"
        style="
          height: 80vh;
          position: absolute;
          width: 99vw;
          top: 30px;
          outline: none;
        "
        v-if="!loadingData"
      >
        <l-tile-layer :url="url"></l-tile-layer>

        <v-marker-cluster>
          <l-marker
            v-for="(detector, index) in detectors_actual"
            :key="'marker-' + index"
            :draggable="true"
            :lat-lng="[detector.lat, detector.lng]"
            @click="addMarker"
          >
            <l-popup>
              <v-card>
                <v-card-title class="headline"></v-card-title>
                <v-card-text
                  ><h5><b>LOCAL: </b>{{ detector.name }}</h5>

                  <h5><b>CODIGO: </b>{{ detector.codigo }}</h5>

                  <h5><b>Vendedor: </b>{{ detector.vendedor }}</h5>
                  <h5><b>Dia: </b>{{ detector.dia }}</h5>
                  <br />
                  <h5>
                    <b>GEO Actual: </b>{{ detector.lat + ";" + detector.lng }}
                  </h5>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>

                  <v-btn
                    color="orange darken-1"
                    dark
                    @click="actualizarLocal(detector)"
                    >Actualizar Geo</v-btn
                  >
                </v-card-actions>
              </v-card></l-popup
            >
          </l-marker>
        </v-marker-cluster>
        <l-control-zoom position="bottomright"></l-control-zoom>
        <l-control position="topleft">
          <v-text-field
            label="Búsqueda Vendedor.."
            @change="SearchLocationVendedor($event)"
            filled
            rounded
            dense
            color="orange darken-1"
          ></v-text-field>

          <v-text-field
            label="Búsqueda Código"
            @change="SearchLocation($event)"
            filled
            rounded
            dense
            color="orange darken-1"
          ></v-text-field>
          <v-select
            :items="items"
            value="TODOS"
            label="Búsqueda Día"
            @change="SearchLocationDia($event)"
            dense
            outlined
            color="orange darken-1"
          ></v-select>
        </l-control>
        <l-control position="bottomleft">
          <v-btn class="ma-2" outlined fab color="teal">
            <v-icon @click="PrintDocumentDocument">mdi-file-excel</v-icon>
          </v-btn>
        </l-control>
      </editable-map>
    </v-flex>
    <v-overlay :value="loadingData">
      <v-progress-circular indeterminate size="84">Cargando..</v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import {
  LMarker,
  LTileLayer,
  LPopup,
  LControl,
  LControlZoom,
} from "vue2-leaflet";
import { EditableMap } from "vue2-leaflet-editable";
import Vue2LeafletMarkercluster from "vue2-leaflet-markercluster";
import activo from "@/assets/activo.png";
import { mapGetters } from "vuex";
import { http } from "@/plugins/axios";
import L from "leaflet";
export default {
  name: "MapApp",
  components: {
    EditableMap,
    LMarker,
    LTileLayer,
    LPopup,
    LControl,
    LControlZoom,
    "v-marker-cluster": Vue2LeafletMarkercluster,
  },
  created() {
    http
      .post(`/Branch/ObtenerLocalesConGeo?cuenta=${this.getUserData.idAccount}`)
      .then((response) => {
        this.detectors = response;
        this.localesTotals = response;
        this.detectorsCount = response.length;
        this.groupedDetectors = this.groupBy(this.detectors, "type", "Name");
        this.detectors_actual = this.detectors;
        this.loadingData = false;
      });
  },
  data() {
    return {
      colors: ["#ff0000", "#0000ff"],
      handlerOptions: {
        radius: 1,
        weight: 1,
      },
      src: {
        activo: activo,
        invactivo: activo,
      },

      zoom: 8,
      center: L.latLng(-1.2317964662810112, -78.205769913041),
      url: "https://cartodb-basemaps-a.global.ssl.fastly.net/light_all/{z}/{x}/{y}@2x.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      clusterOptions: {
        disableClusteringAtZoom: 2,
        chunkedLoading: true,
      },
      items: [
        "",
        "Lunes",
        "Martes",
        "Miercoles",
        "Jueves",
        "Viernes",
        "Sin definir",
        "TODOS",
      ],
      localesTotals: [],
      staticAnchor: [1, 1],
      geojson: null,
      geoJsonLoaded: false,
      drawer: null,

      detectors: [],
      loadingData: true,
      detectors_actual: [],
      groupedDetectors: [],
      geoactualiza: [],
      snackbar: false,
      text: "Se guardo la ubicación",
      timeout: 2000,
      geoactualizas: "ddas",
      detectorsCount: null,
      search: { text: "" },
      eraseDialog: false,
      latitudActualiza: null,
      longitudactualizada: null,
      geoJsonOptions: {
        style: (feature) => {
          if (feature.properties.OWNER === "GWI") {
            return { color: "#0c38dd" };
          } else if (feature.properties.OWNER === "Zayo") {
            return { color: "#ff6e00" };
          } else if (feature.properties.OWNER === "XO") {
            return { color: "#8c08dd" };
          } else {
            return { color: "#000000" };
          }
        },
        onEachFeature: (feature, layer) => {
          if (feature.properties.OWNER) {
            layer.bindPopup("Fiber Cable Owner: " + feature.properties.OWNER);
          } else {
            layer.bindPopup(
              "Lit Building Address: " + feature.properties.ADDRESS
            );
          }
        },
      },
      filtrocodigo: "",
      filtrovendedor: "",
      filtrofecha: "",
      errorDownloadLink: "",
    };
  },
  mounted() {},
  computed: {
    ...mapGetters(["getUserData"]),
  },
  methods: {
    groupBy(array, key1, key2) {
      let result = {};

      array.forEach((item) => {
        if (!result[item[key1][key2]]) {
          result[item[key1][key2]] = [];
        }
        result[item[key1][key2]].push(item);
      });

      return result;
    },
    SearchLocation(_codigoLocal) {
          this.loadingData = true;
      this.filtrocodigo = _codigoLocal;
      let _datos = this.localesTotals.filter(
        (x) =>
          x.codigo.includes(this.filtrocodigo.toUpperCase()) &&
          x.vendedor.includes(this.filtrovendedor.toString().toUpperCase()) &&
          x.dia.includes(this.filtrofecha.toString().toUpperCase())
      );
      if (_datos.length == 1) {
        this.center = L.latLng(_datos[0].lat, _datos[0].lng);
        this.zoom = 10;
      } else {
        this.center = L.latLng(-1.2317964662810112, -78.205769913041);
        this.zoom = 8;
      }
      this.detectors_actual = _datos;
         this.loadingData = false;
    },
    SearchLocationVendedor(_vendedor) {
          this.loadingData = true;
      this.filtrovendedor = _vendedor;
      let _datos = this.localesTotals.filter(
        (x) =>
          x.codigo.includes(this.filtrocodigo.toUpperCase()) &&
          x.vendedor.includes(this.filtrovendedor.toString().toUpperCase()) &&
          x.dia.includes(this.filtrofecha.toString().toUpperCase())
      );

      this.center = L.latLng(-1.2317964662810112, -78.205769913041);
      this.zoom = 8;

      this.detectors_actual = _datos;
         this.loadingData = false;
    },
    SearchLocationDia(_dia) {
          this.loadingData = true;
      this.filtrofecha = _dia == "TODOS" ? "" : _dia;
      let _datos = this.localesTotals.filter(
        (x) =>
          x.codigo.includes(this.filtrocodigo.toUpperCase()) &&
          x.vendedor.includes(this.filtrovendedor.toString().toUpperCase()) &&
          x.dia.includes(this.filtrofecha.toString().toUpperCase())
      );

      this.center = L.latLng(-1.2317964662810112, -78.205769913041);
      this.zoom = 8;

      this.detectors_actual = _datos;
          this.loadingData = false;
    },

    async PrintDocumentDocument() {
      try {
        this.loadingData = true;
        const response = await http.post(
          `/Branch/PrintBranch`,
          this.detectors_actual
        );
        this.errorDownloadLink = response;
        location.href = this.errorDownloadLink;
          this.loadingData = false;
      } catch (e) {
        alert("ERROR AL OBTENER ARCHIVO DE ERRORES");
      } finally {
        this.loadingData = false;
      }
    },
    async opciones() {
      this.eraseDialog = true;
    },
    async actualizarLocal(e) {
      http
        .post(
          `/Branch/ActualizarGeoLocal?idbranch=${e.id}&lat=${this.latitudActualiza}&lon=${this.longitudactualizada}&`
        )
        .then((response) => {
          this.snackbar = true;
          console.log(response);
          this.detectors.find((x) => x.id == e.id).lat = this.latitudActualiza;
          this.detectors.find((x) => x.id == e.id).lng =
            this.longitudactualizada;
        });
      console.log(e);
    },
    addMarker(event) {
      this.longitudactualizada = event.latlng.lng;
      this.latitudActualiza = event.latlng.lat;

      //this.markers.push(event.latlng);
    },
  },
};
</script>

<style scoped>
@import "https://unpkg.com/leaflet@1.4.0/dist/leaflet.css";
@import "https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css";

.leaflet-container {
  height: 50vh;
}
.leaflet-popup-content-wrapper .leaflet-popup-tip {
  background: transparent !important;
  box-shadow: none !important;
}
</style>
