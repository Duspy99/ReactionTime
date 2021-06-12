<template>
    <div class="container py-5 text-light">
           <form @submit.prevent="register">
                <div>
                    <label for="email">Email</label>
                    <b-input name="email" v-model="email" placeholder="email"/>
                </div>
                <div>
                    <label for="username">Username</label>
                    <b-input name="username" v-model="username" placeholder="username"/>
                </div>
                <div>
                    <label for="password">Password</label>
                    <b-input name="password" v-model="password" placeholder="password" type="password"/>
                </div>
                <button class="my-3 mx-1 btn btn-success" type="submit">Register</button>
            </form>
            
            <div v-if="dta.id && dta.email" class="alert alert-success" role="alert">
              <p>Success</p>
            </div>
             <div v-else-if="dta.errors" class="alert alert-danger" role="alert">
               <p v-for="(x,index) of dta.errors" :key="index">
                 {{x.msg + " " + x.param}}
               </p>
            </div>
            <div v-else-if="dta.error" class="alert alert-danger" role="alert">
              <p>{{dta.error}}</p>
            </div>
            
      </div>
</template>

<script>
  export default {
  name: "Register",
  data() {
    return {
      username: "",
      password: "",
      email: "",
      dta:"",
    };
  },
  methods: {
    async register() {
      const { username, password,email} = this;
      const res = await fetch(
        "https://zadatak-mduspara.provjeri.ga/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username,
            password,
            email
          })
        }
      );
      const data = await res.json();
      console.log(data);
      this.dta = data;

      if(this.dta.id){
          this.username = "";
          this.password = "";
          this.email = "";
      }
    }
  }
};
</script>