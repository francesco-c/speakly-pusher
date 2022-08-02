<template>
  <v-container>
    <v-row no-gutters>
      <v-col sm="12" style="position: relative;">
        <div class="chat-container" ref="chatContainer" >
          <p v-for="(item) in conversations" :key="item.id">
            <strong>{{ item.name }}:&nbsp;</strong>{{ item.message }} 
          </p>
        </div>        
      </v-col>
    </v-row>
    <v-layout row align-center>
      <v-flex xs10>
        <v-textarea
          no-resize
          rows="1"
          auto-grow
          v-model="message"
        ></v-textarea>
      </v-flex>
      <v-flex xs2>
        <v-btn large v-on:click="sendMessage" :disabled="message === ''">Send</v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>

  import axios from 'axios';

  export default {
    name: 'Chat',

    data() {
      return {
        'message': '',
        'conversations': []
      }
    },
    mounted() {
        this.socketId = null;
        
        this.$pusher.connection.bind('connected', () => {
            this.socketId = this.$pusher.connection.socket_id;      
        });

        // this.$pusher.connection.on('connected', () => {
        //   this.socketId = this.$pusher.connection.socket_id;
        // });
        
        
        this.channel = this.$pusher.subscribe('a_channel');
        this.config = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };
        
        this.getConversations();
        this.listen();

        
    },
    methods: {
        sendMessage() {
          axios.post('/conversation', this.queryParams({message: this.message}), this.config)
            .then(response => {
              console.log(response);
              this.message = '';
          });
        },
        getConversations() {
          axios.get('/conversations').then((response) => {
            this.conversations = response.data;
            this.readall();
          });  
        },
        listen() {
            this.channel.bind("an_event", (data)=> {
                this.conversations.push(data);
                axios.post('/conversations/'+ data.id +'/delivered', this.queryParams({socket_id: this.socketId}));
            })
            
              this.channel.bind("delivered_message", (data)=> {
                for(var i=0; i < this.conversations.length; i++){
                    if (this.conversations[i].id == data.id){
                        this.conversations[i].status = data.status;
                    }
                }
                
            })
        },
        readall(){

              for(var i=0; i < this.conversations.length; i++){
                    if(this.conversations[i].status=='Sent'){
                        axios.post('/conversations/'+ this.conversations[i].id +'/delivered');
                    }
                }

        },
        queryParams(source) {
          var array = [];

          for(var key in source) {
              array.push(encodeURIComponent(key) + "=" + encodeURIComponent(source[key]));
          }

          return array.join("&");
        }
    }
  }
</script>

<style>
  .scrollable {
    overflow-y: auto;
    height: 90vh;
  }
  .typer{
    box-sizing: border-box;
    display: flex;
    align-items: center;
    bottom: 0;
    height: 4.9rem;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 -5px 10px -5px rgba(0,0,0,.2);
  }
  .typer input[type=text]{
    position: absolute;
    left: 2.5rem;
    padding: 1rem;
    width: 80%;
    background-color: transparent;
    border: none;
    outline: none;
    font-size: 1.25rem;
  }
  .chat-container{
    box-sizing: border-box;
    height: calc(100vh - 9.5rem);
    overflow-y: auto;
    padding: 10px;
    background-color: #f2f2f2;
  }
  .message{
    margin-bottom: 3px;
  }
  .message.own{
    text-align: right;
  }
  .message.own .content{
    background-color: lightskyblue;
  }
  .chat-container .username{
    font-size: 18px;
    font-weight: bold;
  }
  .chat-container .content{
    padding: 8px;
    background-color: lightgreen;
    border-radius: 10px;
    display:inline-block;
    box-shadow: 0 1px 3px 0 rgba(0,0,0,0.2), 0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
    max-width: 50%;
    word-wrap: break-word;
    }
  @media (max-width: 480px) {
    .chat-container .content{
      max-width: 60%;
    }
  }
</style>
