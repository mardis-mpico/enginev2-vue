
<template>

<v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12>
          <v-card dark color="success">
            <v-card-text class="display-1 text-xs-center">14</v-card-text>
          </v-card>
        </v-flex>
        <v-flex  xs12>
          <v-card dark color="secondary">
             <v-date-picker 
             v-model="picker2"
              full-width
              locale="es-cl"
              @change="getdolar(picker2)"
               color="green lighten-1" header-color="primary"></v-date-picker>
          </v-card>
        </v-flex>
               <v-flex xs12>
          <v-card dark color="success">
            <v-card-text class="display-1 text-xs-center">{{valor}}</v-card-text>
          </v-card>
        </v-flex>  
    
       </v-layout>
       <loading></loading>
</v-container>

</template>

<script>
// @ is an alias to /src
import   restclient    from "axios";
import loading from "../components/loading";
import {mapMutations} from "vuex";
export default {
  name: 'grid',
  components: {
    loading,
  },
    data () {
    return {
      picker: new Date().toISOString().substr(0, 10),
      picker2: new Date().toISOString().substr(0, 10),
      valor:null
    }
    },
    methods:{
        async getdolar(fecha){
 try {
      let fechasseparada=fecha.split('-');
       let myDate=fechasseparada[2]+'-'+fechasseparada[1]+'-'+fechasseparada[0]

         this.OpenLoading("Cargando precios");
        let datos= await restclient.get( `https://mindicador.cl/api/dolar/${myDate}`);

        if(datos.data.serie.length>0){

                console.log(datos.data.serie);
                this.valor=datos.data.serie[0].valor;

        }else{
            console.log("Sin datos");

            this.valor="Sin datos";

        }
                    
        } catch (error) {
               this.valor="Sin datos";
            console.log("Sin datos");
        }finally{

              this.CloseLoading();
        }
      


        }   ,
    ...mapMutations(['OpenLoading']),
    ...mapMutations(['CloseLoading']),
    

    }
    ,created(){
      
   

    }
}
</script>