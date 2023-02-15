// import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.29/vue.esm-browser.min.js';
const apiUrl = 'https://vue3-course-api.hexschool.io';
const apiPath = 'helena27';

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== 'default') {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});

VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

const productModal = {
  props:['id','addToCart','openModal'],
  data(){
    return{
      tempProduct:{},
      modal:{},
      qty:1,
    }
  },
  template :'#userProductModal',
  watch:{
    id(){
      console.log('productModal:',this.id);
      if(this.id){
        axios.get(`${apiUrl}/v2/api/${apiPath}/product/${this.id}`)
        .then((res)=>{
          this.tempProduct = res.data.product
          console.log('單一產品',this.tempProduct);
          this.modal.show();
        })
      }
    }
  },
  methods:{
    hide(){
      this.modal.hide();
    },
    

  },
  mounted(){
   this.modal = new bootstrap.Modal(this.$refs.modal);
   this.$refs.modal.addEventListener('hidden.bs.modal', event => {
    console.log('modal被關閉');
    this.openModal('');
  })
  }
};

const app = Vue.createApp({
  data(){
    return{
     products:[],
     productId:'',
     cart:[],
     loadingItem:'',
     user: {
        email: '',
        name: '',
        tel: '',
        address: '',
      },
      message: '',
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
      this.productId = id;
      console.log('外層帶入productId' ,id);
      this.getCarts();
    },
    addToCart(product_id,qty=1){//預設等於1
      const data = {
        product_id,
        qty
      };
      axios.post(`${apiUrl}/v2/api/${apiPath}/cart`,{ data })
        .then((res)=>{
          console.log('加入購物車',res.data);
          alert('已加入購物車')
          this.$refs.productModal.hide();
          this.getCarts();
        })
    },
    getCarts(){
      axios.get(`${apiUrl}/v2/api/${apiPath}/cart`)
        .then((res)=>{
          this.cart = res.data.data;
          console.log('取得購物車',res.data.data);
        })
    },
    updateCart(item){//購物車id+產品id
      this.loadingItem = item.id;
      const data = {
        "product_id":item.product.id,
        "qty": item.qty
      }
      console.log(data,item.id);
      axios.put(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`,{ data })
      .then((res)=>{
        console.log('更新購物車',res.data);
        this.getCarts();
        this.loadingItem = '';
      })
    },
    removeCartItem(item){
      this.loadingItem = item.id;
      axios.delete(`${apiUrl}/v2/api/${apiPath}/cart/${item.id}`)
      .then((res)=>{
        alert('刪除單一購物車成功')
        console.log('刪除單一購物車',res.data);
        this.getCarts();
        this.loadingItem = '';
      })
    },
    deleteAllCarts(){
      axios.delete(`${apiUrl}/v2/api/${apiPath}/carts`)
      .then((res)=>{
        alert('刪除全部購物車成功')
        console.log('刪除全部購物車',res.data);
        this.getCarts();
      })
    },
    isPhone(value) {
      const phoneNumber = /^(09)[0-9]{8}$/
      return phoneNumber.test(value) ? true : '需要正確的電話號碼'
    },
    onSubmit() {
      const data = {
        user:this.user,
        message:this.message,
      };
      console.log(data);
      
      if(this.cart.carts.length === 0){
        alert('購物車內無商品，請加入商品');
        return;
      }
      axios.post(`${apiUrl}/api/${apiPath}/order`,{ data })
        .then((res)=>{
          alert(res.data.message);
          this.$refs.form.resetForm();
          this.getCarts();
        }).catch((err) => {
          alert(err.response.data.message);
        });
    },
  },
  components:{
    productModal,
  },
  mounted(){
    this.getProducts();
    this.getCarts();
  },
})
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);




app.mount('#app')

