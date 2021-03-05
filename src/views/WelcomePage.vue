<template>
  <div class="about">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <button class="btn btn-outline-primary mt-3" @click="logout">Logout</button>
        </div>
      </div>

      <div class="row justify-content-center mt-5">
        <div class="col-md-9">
          <div class="input-group">
            <input type="text" v-model="text" class="form-control" aria-label="Text input with checkbox">
            <input type="button" class="btn btn-outline-secondary ml-3" @click="onSave()" value="+" aria-label="Add">
          </div>
        </div>
      </div>

      <div class="row justify-content-center mt-5" v-for="item,index in todoArray" :key="index">
        <div class="col-md-9">
          <div class="input-group mb-3">
            <div class="input-group-prepend">
              <div class="input-group-text">
                <input type="checkbox" v-model="isChecked" value="item.isChecked" aria-label="Checkbox for following text input">
              </div>
            </div>
                <input type="text" v-model="item.text" class="form-control" aria-label="Text input with checkbox">
                <input type="button" class="btn btn-outline-primary ml-1" value="Save" aria-label="Save">
                <input type="button" class="btn btn-outline-primary ml-1" value="Delete" aria-label="Delete">
                <input type="button" class="btn btn-outline-secondary ml-3 add-btn" value="+" aria-label="Save">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import fetch from "node-fetch";

export default {
  
  methods: {
    ...mapActions('user', {
      logout: 'logout'
    }),
    onSave(){
      return fetch('/.netlify/functions/todos-create',{
        body: JSON.stringify(this.todoArray),
        method: 'POST'
      }).then(response=>{
        console.log(response);
        return response
      })
    }
  },
  data : function(){
    return{
      todoArray: [
        {isChecked : false, text : 'todo number one'},
        {isChecked : false, text : 'todo number two'},
        {isChecked : false, text : 'todo number three'},
      ],
      isChecked: false, 
      text: ''
    }
  }
}
</script>

<style scoped>
  .add-btn{
    border-radius: 100%;
    color: white  !important;
    background: grey;
    position: fixed;
    bottom: 10px;
    right: 10px; 
    width: 60px;
    height: 60px;
  }
</style>
