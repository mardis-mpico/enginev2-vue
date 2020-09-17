<template>
  <div>
    <v-row>
      <v-col>
        <h1 class="font-weight-light">Control Rutas</h1>
      </v-col>
      <v-col class="text-right align-self-center">
        <v-btn
          class="pa-0"
          tile
          outlined
          to="DashBoard/Pollsters"
          color="error"
        >
          <v-col class="text-center">
            <v-icon>mdi-account-group</v-icon>
            <h6>Mercaderistas</h6>
          </v-col>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="justify-lg-space-between">
      <v-col lg="5" cols="sm" class="pb-2">
        <v-card class="pa-3">
          <v-row class="align-baseline">
            <v-col cols="5" lg="4">
              <h3 class="font-weight-light">Rutas Activas</h3>
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
            <!--<template slot="body.append">
              <tr class="primary--text">
                <th class="title">Totals</th>
                <th class="title">{{ sumField("sales") }}</th>
                <th class="title">{{ sumField("customers") }}</th>
                <th class="title">{{ sumField("items") }}</th>
              </tr>
            </template>-->
          </v-data-table>
        </v-card>
      </v-col>
      <v-col lg="7" cols="sm" class="pb-2">
        <v-card class="pa-3">
          <h3 class="font-weight-light pb-3">Encuestadores</h3>
          <v-data-table
            :headers="headers"
            :items="reportItems"
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
            <!--<template slot="body.append">
              <tr class="primary--text">
                <th class="title">Totals</th>
                <th class="title">{{ sumField("sales") }}</th>
                <th class="title">{{ sumField("customers") }}</th>
                <th class="title">{{ sumField("items") }}</th>
              </tr>
            </template>-->
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
    <!--<v-row>
      <v-col lg="4" cols="sm" class="pb-2">
        <v-card>
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="cyan fill-height pa-1"></div>
            </div>
            <div class="col pa-3 py-4 cyan--text">
              <h5 class="text-truncate text-uppercase">Sales</h5>
              <h1>53</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="4" cols="sm" class="pb-2">
        <v-card>
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="primary fill-height pa-1"></div>
            </div>
            <div class="col pa-3 py-4 primary--text">
              <h5 class="text-truncate text-uppercase">Growth</h5>
              <h1>23%</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
      <v-col lg="4" cols="sm" class="pb-2">
        <v-card>
          <v-row class="no-gutters">
            <div class="col-auto">
              <div class="success fill-height pa-1"></div>
            </div>
            <div class="col pa-3 py-4 success--text">
              <h5 class="text-truncate text-uppercase">Calls</h5>
              <h1>213</h1>
            </div>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col lg="4" cols="md" class="pb-2">
        <v-card class="dark">
          <v-card-title class="font-weight-light text-truncate cyan--text">
            Orders
          </v-card-title>
          <v-card-text>
            <v-carousel
              cycle
              height="180"
              interval="2000"
              hide-delimiter-background
              show-arrows-on-hover
              light
            >
              <v-carousel-item>
                <div class="row no-gutters">
                  <div class="col">
                    <div>
                      <h2 class="cyan--text">Randy Sheets</h2>
                      <p class="mt-1">Tutankum, WI 33192</p>
                      <h3 class="mb-0">
                        $217.00
                        <i
                          class="mdi mdi-36px mdi-credit-card-outline float-right"
                        ></i>
                      </h3>
                      <p>Total items: 5</p>
                    </div>
                  </div>
                </div>
              </v-carousel-item>
              <v-carousel-item>
                <div class="row no-gutters">
                  <div class="col">
                    <div>
                      <h2 class="cyan--text">Jose Valdex</h2>
                      <p class="mt-1">Turnup, PA 23192</p>
                      <h3 class="mb-0">
                        $97.00
                        <i class="mdi mdi-36px mdi-paypal float-right"></i>
                      </h3>
                      <p>Total items: 2</p>
                    </div>
                  </div>
                </div>
              </v-carousel-item>
            </v-carousel>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col lg="4" cols="md" class="pb-2">
        <v-card min-height="252">
          <v-card-title class="font-weight-light text-truncate primary--text">
            Goals
          </v-card-title>
          <v-card-text>
            <p class="primary--text subtitle-1">
              Results from last campaign
            </p>
            <div class="my-5">
              <v-progress-linear
                indeterminate
                height="8"
                color="primary"
              ></v-progress-linear>
              <h6>SINCE JAN 2020</h6>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined rounded color="primary">
              Details
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col lg="4" cols="md" class="pb-2">
        <v-card min-height="252">
          <v-card-title class="font-weight-light text-truncate success--text">
            On-boarding
          </v-card-title>
          <v-card-text>
            <span class="success--text subtitle-1">
              Judy Pincus
            </span>
            <div class="mb-3">
              @jpincus
              <h3>Service Manager</h3>
              <span class="overline">Start date: 5/12/2020</span>
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn outlined rounded color="success">
              View
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="mx-auto text-center">
          <v-card-title class="primary--text">
            Sales
          </v-card-title>
          <v-sparkline
            :value="sparklineData"
            padding="18"
            label-size="4"
            color="cyan"
            :gradient="['#007bff', 'cyan']"
            :line-width="2"
            :stroke-linecap="'round'"
            smooth
          >
            <template v-slot:label="item"> ${{ item.value }} </template>
          </v-sparkline>
          <v-card-actions class="py-4 justify-center">
            <v-btn color="primary" to="/reports">View Report</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>-->
    <v-footer fluid color="white darken-4" class="py-3 elevation-1">
      <span class="ml-auto overline"
        >Copyright © 2016-2020 Chariot. All rights reserved</span
      >
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: "",
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
        {
          id: 2,
          name: "Safety gloves",
          sales: 62,
          customers: 12,
          items: 70,
          available: null,
        },
        {
          id: 3,
          name: "Widget 2",
          sales: 262,
          customers: 32,
          items: 1020,
          available: null,
        },
        {
          id: 4,
          name: "Widget 4",
          sales: 362,
          customers: 12,
          items: 190,
          available: null,
        },
        {
          id: 4,
          name: "Widget 4",
          sales: 362,
          customers: 12,
          items: 190,
          available: null,
        },
        {
          id: 19,
          name: "Widget ABC",
          sales: 62,
          customers: 5,
          items: 17,
          available: null,
        },
        {
          id: 12,
          name: "Widget 12",
          sales: 262,
          customers: 22,
          items: 199,
          available: null,
        },
      ],
      //sparklineData: [423, 446, 675, 510, 590, 610, 423],
    };
  },
  computed: {
    sumField(key) {
      // sum data in give key (property)
      return this.reportItems.reduce((a, b) => a + (b[key] || 0), 0);
    },
  },
  methods: {},
};
</script>
