<template>
<div id="leaderboard" class="text-light" v-if="scores">
  <div class="container py-5">
    <div class="py-5 text-center">
      <h1>Leaderboard</h1>
    </div>
      <table class="table text-light">
    <thead>
      <tr>
      <th>
        #
      </th>
      <th>
        Name
      </th>
      <th>
        Reaction
      </th>
      </tr>
    </thead>
    <tbody>
      <tr  v-for="data,index in scores" :key="index">
        <td>
          {{index +1}}
        </td>
         <td>
          {{data.user.username}}
        </td>
         <td>
          {{data.reactionTime}} ms
        </td>
      </tr>
    </tbody>
  </table>
</div>
  </div>

</template>

<script>
import axios from 'axios';
export default {
    data(){
        return{
          scores:null,
            
        }
    },
        created()
        {
          let el = this;
       axios.get('https://zadatak-mduspara.provjeri.ga/ranking/top').then(function(response){
        
         console.log(response.data.rows);
        el.scores = response.data.rows;
       }).catch((err) => {
         console.log("error",err);
       });
    }
}
</script>