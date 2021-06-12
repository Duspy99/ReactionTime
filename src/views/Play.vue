<template>
<div id="play">
     <div class="text-center text-light text-uppercase py-5">
        <p>User: {{user.username}}</p>
    </div>
    <div id="gameConsole" class="container text-light py-5">
        <div class="text-center">
            <h5>GAME CONSOLE</h5>
        </div>
        <div>
            <div class="text-center">
                
                 <div v-if="!gameFinished && !game && currentLobby">
                    <p>Waiting for players.</p>
                </div>
                <div v-if="gameFinished">
                    <p>GAME FINISHED!</p>
                    <p>🏆WINNER🏆</p>
                    <p class="text-uppercase">{{gameFinished.game.winner}}</p>
                     <div v-if="scoreboard" class="py-2">
                            <div>
                                <div v-for="(score,index) of scoreboard" :key="index">
                                    <p><b class="text-uppercase">{{score.user.username}}</b> : <b>{{score.reactionTime  ?  score.reactionTime  + " ms" : "waiting..."}} </b></p>
                                </div>
                            </div> 
                    </div>
                </div>

                <div v-if="game">
                    <p>{{game.state}}</p>
                    <div v-if="game.state == 'STARTING'">
                        <p>Game start for: {{startingTime}} ms :)</p>
                    </div>

                    <div v-if="game.state == 'IN_PROGRESS'">
                        <div  class="py-5">
                        <div v-if="click == null">
                            <button class="btn btn-danger btn-lg py-5 px-5" style="border-radius: 50%;" disabled>Prepare</button>
                        </div>
                        <div v-if="click == 'click'">
                            <button  v-on:click="updateRoundResult()" class="btn btn-success btn-lg py-5 px-5" style="border-radius: 50%;">Click!</button>
                        </div>
                        <div v-if="click == 'clicked'">
                            <button class="btn btn-dark btn-lg py-5 px-5" style="border-radius: 50%; " disabled>Clicked!</button>
                        </div>
                        </div>

                         <p v-if="clickDifference" class="pb-2">{{"Your click time: " + clickDifference + " ms"}}</p>

                         <div v-if="scoreboard" class="pb-2">
                
                            <div>
                                <div v-for="(score,index) of scoreboard" :key="index">
                                    <p><b class="text-uppercase">{{score.user.username}}</b> : <b>{{score.reactionTime  ?  score.reactionTime  + " ms" : "waiting..."}} </b></p>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>
        
    </div>
       <div class="text-center text-light pt-5">
                <div v-for="(lobby,index) of lobbies" :key="index">
                    <div v-if="lobby.channel == currentLobby && !game">
                        <p>Lobby state: {{lobby.state}}</p>
                        <p>PLAYERS:</p>
                    
                     
                            <div class="text-light text-center">
                                 <div v-for="player,index of lobby.players" :key="index">
                                     <p class="text-uppercase">{{index+1 + " - "}}{{player.username}}</p>
                                </div>
                            </div>
                           
                     
                    </div>           
                </div>
            </div>


    <div class="d-flex column justify-content-center text-light py-3" v-if="lobbies">
        
        <div v-for="(lobby,index) of lobbies" :key="index" class="p-2 my-1">
           <div v-if="lobby.channel == currentLobby">
               <button class="btn btn-dark" v-on:click="joinLobby(lobby)" disabled>{{lobby.name}}</button>
               <div class="py-2">
                    <button class="btn btn-warning" v-on:click="leaveLobby(lobby)">Logout.</button>
               </div>
             
           </div>

           <div v-if="lobby.channel != currentLobby">
               <button v-on:click="joinLobby(lobby)" class="btn btn-light text-light" style="background-color:#43284f;">{{lobby.name}}</button>
           </div>
           
        </div>

    </div>

</div>



</template>



<script>

import VueSocketIOExt from 'vue-socket.io-extended';
import { io } from 'socket.io-client';
import Vue from 'vue';
import {mapGetters} from 'vuex';
const token = localStorage.getItem('token');
  const socket = io('https://zadatak-mduspara.provjeri.ga/', {
    query: {
      token:token
    },
    
  });

  Vue.use(VueSocketIOExt, socket);
export default {
    data(){
        return{
            lobbies:null,
            currentLobby:null,
            game:null, 
            gameFinished:null,
            click:null,
            currentTime:null,
            triggerDate:null,
            clickDifference:null,
            startingTime:null,
            scoreboard:null,
        }
    },

     computed: {
    ...mapGetters({
      user: 'auth/user',
      authenticated: 'auth/authenticated',
      })
    },

    
    sockets: 
    {
        
        connect()
        {
            this.$socket.$subscribe('lobbies', payload => {
                this.lobbies = payload;
                console.log("Connected");
            });
            this.$socket.$subscribe('lobbies_update', payload => {
                this.lobbies = payload;
            });                         
        },
    },
    methods: 
    {
        joinLobby(lobby)
        {
            if(this.currentLobby != null)
            {
                    this.$socket.client.emit('leaveLobby',this.currentLobby);
                    this.$socket.client.emit('joinLobby',lobby.channel);
                    this.currentLobby = lobby.channel;
                    this.gameUpdate();
            }

            else if(this.currentLobby == null)
            {
                    this.$socket.client.emit('joinLobby',lobby.channel);
                    this.currentLobby = lobby.channel;
                    this.gameUpdate();                
            }
        },

        leaveLobby(lobby)
        {
            this.$socket.client.emit('leaveLobby',lobby.channel);
            this.clearPlayer();
        },
        clearPlayer()
        {
            this.currentLobby = null;
            this.game = null;
            this.click = null;
            this.gameFinished = null;
            this.scoreboard = null;
            this.currentTime = null;
            this.triggerDate = null;
            this.clickDifference = null;
            this.$socket.$unsubscribe('game_finished');
            this.$socket.$unsubscribe('game_update'); 
        },

        gameUpdate()
        {
        
            this.$socket.$subscribe('game_update', payload => 
            {   
                if(this.game)
                {
                    if(this.game.game.currentRound != payload.game.currentRound && this.game.game.currentRound != null)
                    {
                        this.scoreboard = payload.game.rounds.slice(-1).pop().rankings; 
                        this.clickDifference = null;
                        this.click = null;
                        this.gameCheck(payload);
                    }
                    else
                    {
                        this.scoreboard = payload.game.rounds.slice(-1).pop().rankings; 
                        this.game = payload;
                        this.gameTrue();
                    }
                }
                else
                {
                    this.game = payload;
                    this.gameTrue();

                }
            });

            this.$socket.$subscribe('game_finished', payload =>
            {
                this.gameFinished = payload;
                this.currentLobby = null;
                this.click = null;
                this.triggerDate = null;
                this.currentTime = null;
                this.game = null;
                this.clickDifference = null;
                this.$socket.$unsubscribe('game_update');
                this.$socket.$unsubscribe('game_finished');
                setTimeout(() => {this.gameFinished = null,this.scoreboard = null}, 5000);
            });     

        },

        gameCheck(payload)
        {
            let rankings = this.game.game.rounds.pop().rankings;
        
            
            if(rankings)
            {
                let reaction = null;
                let userToKick = null;
                for(const rank of rankings)
                {
                  
                    if(rank.reactionTime > reaction)
                    {
                        reaction = rank.reactionTime;
                        userToKick = rank.user.id;
                    }
                    
                }
                if(this.user.id === userToKick)
                {
                    this.clearPlayer();
                }
                else
                {
                    this.game = payload;
                    this.gameTrue();
                }
            }
        },
        gameTrue()
        {
        if(this.game.state == 'IN_PROGRESS' && this.click == null)
        {
         
            let d = new Date();
            let tg =  new Date(this.game.game.triggerDate);

            this.currentTime = d.getTime();
            this.triggerDate = tg.getTime();

            let timeout = (this.triggerDate - this.currentTime)

            if(timeout > 0.0 && this.click == null)
            {
                setTimeout(() =>  this.click = "click", timeout);
            }
        }
        if(this.game.state == 'STARTING')
        {
           
            let st =  new Date(this.game.startingTime);
          
            st.getTime();

            const el = this;
          
            const timer = setInterval(function()
            {
                let cd = new Date();
                cd.getTime();
                let tm = st - cd;
                el.startingTime = tm - 500;
               
                if(tm < 0)
                {
                    el.startingTime = null;
                    clearInterval(timer);
                }
            }, 0);
      
            
        }
    },

        updateRoundResult()
        {
            var d = new Date();
            let currentTime = d.getTime();

            let roundUuid = this.game.game.currentRound
            let gameUuid = this.game.game.uuid
            let triggerDate = this.triggerDate;

            let clickDifference = currentTime - triggerDate;
            this.$socket.client.emit('updateRoundResult',
            {roundUuid:roundUuid,gameUuid:gameUuid,clickDifference:clickDifference});


            this.clickDifference = clickDifference
            this.currentTime = currentTime;
            this.click = "clicked";

        },
        
    },
    created()
    {
    }
};
</script> 


<style scoped>
#gameConsole {
    background: rgb(63, 5, 102);
    border: 1px solid white;
}
</style>