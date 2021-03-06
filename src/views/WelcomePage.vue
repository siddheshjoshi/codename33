<template>
  <div class="about">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12 ">
          <button class="btn btn-outline-primary mt-3" @click="logout">Logout</button>
        </div>
      </div>
    </div>
    <transition name="fade">
    <div class="container">
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
                <input type="checkbox" v-model="item.isChecked" @click="onEdit(item)" value="item.isChecked" aria-label="Checkbox for following text input">
              </div>
            </div>
                <input type="text" v-model="item.text" class="form-control" aria-label="Text input with checkbox">
                <input type="button" class="btn btn-outline-primary ml-1" value="Edit" @click="onEdit(item)" aria-label="Edit">
                <input type="button" class="btn btn-outline-primary ml-1" value="Delete" @click="onDelete(item)" aria-label="Delete">
          </div>
        </div>
      </div>
    </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios';
export default {
  
  methods: {
    ...mapActions('user', {
      logout: 'logout'
    }),
    onSave(){
      let objRandom = {"isChecked": false, "text": this.text}
      axios.post('/.netlify/functions/todos-create',objRandom).then(response=>{
      }).catch(error=>{
        console.warn(error)
      }).finally(()=>{
        this.todoArray = []
        this.getAll()})
    },
    getAll(){
      axios.get('/.netlify/functions/todo-read-all').then((response)=>{
        // this.todoArray.push(response.data);
        response.data.forEach(element => {
          this.todoArray.push({isChecked: element.data.isChecked, text: element.data.text, id: element.ref.['@ref'].id})
        })
      }).catch(error=>{
        console.warn(error)
      }).finally(() => {
        console.log('Read Completed..');
      })
    },
    onEdit(todoItem){
      console.warn('editing isChecked: ', todoItem.isChecked)
      console.warn('Not is: ', !todoItem.isChecked)
      console.table(todoItem)
      axios.post('/.netlify/functions/todos-update', {id: todoItem.id, text: todoItem.text, isChecked: !todoItem.isChecked })
      .then((response)=>{

      })
      .finally(()=>{
        this.todoArray = []
        this.getAll()
      })
    },
    onDelete(todoItem){
      axios.post('/.netlify/functions/todos-delete',{id:todoItem.id})
      .then((response)=>{
        console.log(response)
      })
      .finally(()=>{
        this.todoArray = []
        this.getAll()
      })
    }
  },
  created(){
    this.getAll();
  },
  data : function(){
    return{
      todoArray: [],
      isChecked: false, 
      text: '',
      deleteTodos: []
    }
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0
}


.bounce-enter-active {
  animation: bounce-in .8s;
}
.bounce-leave-active {
  animation: bounce-in .5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
