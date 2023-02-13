import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'helena27';

const productModal = {
  props:['id'],
  data(){
    return{
      tempProduct:{},
      modal:{}
    }
  },
  template :'#userProductModal',
  watch:{
    id(){
      console.log('productModal:',this.id);
      axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then((res)=>{
          this.tempProduct = res.data.products
          console.log('單一產品',res.data.products);
          this.modal.show();
        })
    }
  },
  mounted(){
   this.modal = new bootstrap.Modal(this.$refs.modal);
  }
};

const app = createApp({
  data(){
    return{
     products:[],
     productId:'',
    }
  },
   methods:{
    getProducts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/products/all`)
        .then((res)=>{
          this.products = res.data.products
          console.log(res.data.products);
        })
    },
    openModal(id){
      this.productId === id;
      console.log('外層帶入productId' ,id);
    }
  },
  components:{
    productModal,
  },
  mounted(){
    this.getProducts();
  },
})

app.mount('#app')