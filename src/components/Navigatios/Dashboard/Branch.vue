<template>
  <div>
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
    <v-flex text-xs-center>
      {{ geoactualiza }}
      {{ geoactualizas }}
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
      >
        <l-tile-layer :url="url"></l-tile-layer>

        <v-marker-cluster > 
          <l-marker
            v-for="(detector, index) in detectors_actual"
            :icon="icon"
            :key="'marker-' + index"
            :draggable="true"
            :lat-lng="[detector.lat, detector.lng]"
         
            @update:latLng="actualizarLocal"
          >
            <l-tooltip>{{ detector.name }}</l-tooltip>
          </l-marker>
        </v-marker-cluster>
      </editable-map>
    </v-flex>
  </div>
</template>

<script>
import { LMarker, LTileLayer, LTooltip } from "vue2-leaflet";
import { EditableMap } from "vue2-leaflet-editable";
import Vue2LeafletMarkercluster from "vue2-leaflet-markercluster";
import { http } from "@/plugins/axios";
import L from "leaflet";
export default {
  name: "MapApp",
  components: {
    EditableMap,
    LMarker,
    LTileLayer,
    LTooltip,
    "v-marker-cluster": Vue2LeafletMarkercluster,
  },
  created() {
    http.post(`/Branch/ObtenerLocalesConGeo?cuenta=15`).then((response) => {
      console.log(response);
      this.detectors = response;
      this.detectorsCount = response.length;
      this.groupedDetectors = this.groupBy(this.detectors, "type", "Name");
      this.detectors_actual = this.detectors;
    });
  },
  data() {
    return {
      colors: ["#ff0000", "#0000ff"],
      handlerOptions: {
        radius: 1,
        weight: 1,
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
      geojson: null,
      geoJsonLoaded: false,
      drawer: null,
      detectors: [],
      detectors_actual: [],
      groupedDetectors: [],
      geoactualiza: [],
      geoactualizas: "ddas",
      detectorsCount: null,
      search: { text: "" },
      eraseDialog:false,
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
    };
  },
  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;
      const drawControl = new window.L.Control.Draw({
        position: "topright",
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true,
          },
          polygon: false,
          rectangle: false,
          circle: false,
          marker: false,
        },
      });

      map.addControl(drawControl);

      const editableLayers = new window.L.FeatureGroup().addTo(map);
      map.on(window.L.Draw.Event.CREATED, (e) => {
        // const type = e.layerType;
        const layer = e.layer;

        // Do whatever else you need to. (save to db, add to map etc)
        editableLayers.addLayer(layer);
      });
    });
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
    async opciones() {
        this.eraseDialog=true
    },
    async actualizarLocal(e) {
      console.log(e.lat);
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
</style>
