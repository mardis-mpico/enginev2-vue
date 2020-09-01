
<template>

 <v-dialog
      v-model="dialog.open"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
            {{dialog.mess}}
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
 
</template>

<script>
// @ is an alias to /src
import {mapState} from "vuex";

export default {
  name: 'loading',
  computed: {
   ...mapState(['dialog'])
  },
  components: {

  },
    data () {
    return {
 
    }
    },
    methods:{
   

    }
    ,created(){
      
  
    }
}
</script>