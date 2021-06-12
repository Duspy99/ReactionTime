<template>
<div class="py-5 text-light">
<form @submit.prevent="submit">
  <div class="container py-5">
    <label for="email">Email</label>
    <b-input type="text" name="email" v-model="form.email"/>
    <br>
    <label for="password">Password</label>
    <b-input type="password" name="password" v-model="form.password"/>
    <br>
    <button class="btn btn-success" type="submit">Sign in</button>
  </div>
</form>
<div class="container">
 <div v-if="msg == '404'" class="alert alert-danger text-center" role="alert">
   Invalid input email
</div>
<div v-else-if="msg == '401'" class="alert alert-danger text-center" role="alert">
  Invalid input password
</div>


 </div>
</div>

</template>

<script>
import {mapActions} from 'vuex';

  export default{
    data(){
      return{
        form:{
          email:'',
          password:''
        },
        msg:null,
      }
    },
    methods:{
      ...mapActions({
        signIn:'auth/signIn'
      }),
     submit()
     {
        this.signIn(this.form).then(() => {
          this.msg = null;
          this.$router.push({ name: 'Play' })
        }).catch((err) => {
          let e = err.toString();
          let s = e.split(" ");
          this.msg = s[s.length - 1];
          console.log(this.msg);
        });
        console.log("submit");
      },
  
    },


  }
</script>
