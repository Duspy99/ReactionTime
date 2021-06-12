import axios from 'axios';

export default ({
    namespaced:true,
    state: {
        token:null,
        user:null,
        ranking:null
    },
    getters:{
        authenticated(state){
            return state.token && state.user;
        },

        user(state){
            return state.user
        },

        ranking(state){
            console.log(state.ranking);
            return state.ranking;
        }
    },
    mutations: {
        SET_TOKEN (state,token) {
            state.token = token 
        },
        SET_USER (state,data) {
            state.user = data
        },
        SET_RANKING(state,data){
            state.ranking = data
        }
    },
    actions: {
        async signIn ({dispatch},credentials) {
            let response = await axios.post("https://zadatak-mduspara.provjeri.ga/auth/login",credentials);
          

            return dispatch('attempt',response.data.token)
            
        },  

        async attempt ({commit,state}, token) {
            if(token){
                commit('SET_TOKEN',token);
            }

            if(!state.token){
                return null
            }

            try {
                let response =  await axios.get('https://zadatak-mduspara.provjeri.ga/auth/me');
            
                commit('SET_USER',response.data);
            
            }catch(e){
                commit('SET_TOKEN',null);
                commit('SET_USER',null);
                console.log("Fail!")
                console.log(e);
               
            }
        },
        async ranking({commit}){
            try{
                let response = await axios.get('https://zadatak-mduspara.provjeri.ga/ranking/top');
                console.log(response.data);
                commit('SET_RANKING',response.data);
            }catch(e){
                console.log("Fail!")
                console.log(e);
               
            }
        }
    },
  })
  