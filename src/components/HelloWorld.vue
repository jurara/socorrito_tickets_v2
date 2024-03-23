<template>
  <v-container>
    <v-col md="12">
      <v-row justify='end' style="background-color: white">
        <v-col cols="12" sm="6" md="4">
          <v-text-field elevation="8" label="Buscar" hint="Escribe el nombre del producto a buscar" v-model="search"
            clearable variant="outlined"></v-text-field>
          
        </v-col>
        <v-col cols="12" sm="3" md="1">
          <v-dialog v-model="dialog" persistent width="1024">
              <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props">
                  Ticket
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Crear ticket personalizado</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Producto" required v-model="producto"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Gramaje" required v-model="gramaje"></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field label="Codigo de barras / QR" required v-model="codigo"></v-text-field>
                      </v-col>

                    </v-row>
                  </v-container>
                  <small>*Recuerda que si este producto no existe deberas registrarlo en tu sistema de ventas para poder
                    utilizar este QR</small>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                    Cancelar
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="modalPDF">
                    Crear
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          
        </v-col>

      </v-row>
    </v-col>


    <EasyDataTable :headers="headers_dos" :items="bar_codes" show-index buttons-pagination
      :server-items-length="total_bar_codes" :rows-items="[5, 10, 25, 30]" :rows-per-page="10" :search-field="nombre"
      :search-value="search" :loading="loading">
      <template #loading>
        <img src="../assets/search.gif" />
      </template>

      <template #item-ticket="item" >
        <div class="operation-wrapper manita">

          <img src="../assets/pdf.png" class="operation-icon ml-1"
            @click="generarTicket(item.nombre, item.gramaje, item.codigo)" width="30" height="30" />
        </div>
      </template>

    </EasyDataTable>
  </v-container>

</template>

<script>
//import Loading from 'vue3-loading-overlay';

//import 'vue3-loading-overlay/dist/vue3-loading-overlay.css';
import Swal from 'sweetalert2';

export default {
  name: 'HelloWorld',

  props: {
    msg: String
  },
  data() {
    return {
      loading: false,
      generando: false,
      dialog: false,
      search: '',
      producto: '',
      gramaje: '',
      codigo: '',
      cb: 'bar_codes',
      test: 'http://192.168.1.78:88/cereales/site_php/wsObtenerArticulosLista.php',
      //test: 'https://8752-189-177-185-226.ngrok-free.app/cereales/site_php/wsObtenerArticulosLista.php',
      headers_dos: [
        { text: 'Producto', value: 'nombre' },
        { text: 'Gramaje', value: 'gramaje' },
        { text: 'Codigo de barras', value: 'codigo' },
        { text: 'Ticket', value: 'ticket' }
      ],
      bar_codes: [{"nombre":" AMARILLO HUEVO 170 100 GR","gramaje":"PZ","codigo":"0781159000492"}],
      gases: [],
      total_bar_codes: 0
    }
  },
  methods: {
    getBarCodes() {
      this.loading = true;
      this.$axios.get(this.test, {
        "Content-Type": "application/json"

      })
        .then(response => {
          this.bar_codes = response.data
          this.total_bar_codes = response.data.length
          //this.loading = false;
        })
        .catch(error => {
          console.log(error)
          //this.loading = false;
        }).finally(() => {
          this.loading = false;
        });
    },
    modalPDF() {
      this.generarTicket(this.producto, this.gramaje, this.codigo);
    },
    async generarTicket(p_nombre, p_gramaje, p_codigo) {
      const loadingAlert = Swal.fire({
        title: 'Generando archivo',
        text: 'Por favor, espera un momento...',
        allowOutsideClick: false, // Evita que se cierre haciendo clic fuera del modal
        showConfirmButton: false, // Oculta el botón de confirmación
        willOpen: () => {
          Swal.showLoading();
        }
      });
      this.$axios.post('http://192.168.1.78:3000/generate-pdf', {
        nombre: p_nombre ? p_nombre : '',
        gramaje: p_gramaje ? p_gramaje : '',
        codigo: p_codigo ? p_codigo : ''
      }, {
        responseType: 'arraybuffer'
      })
        .then(response => {
          this.dialog = false;
          this.producto = '';
          this.gramaje = '';
          this.codigo = '';
          const blob = new Blob([response.data], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);

          // Abre el PDF en una nueva pestaña
          window.open(url, '_blank');
          loadingAlert.close();
          Swal.fire({
            icon: 'success',
            title: 'Archivo generado',
            text: 'El archivo se generó correctamente',
            showConfirmButton: false,
            timer: 1500
          });
        })
        .catch(error => {
          console.log(error)
          loadingAlert.close();
          Swal.fire('Error', 'Hubo un problema al generar el archivo', 'error');
        });



    },

  },
  created() {
    this.getBarCodes()
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
.manita {
  cursor: pointer;
}
</style>
