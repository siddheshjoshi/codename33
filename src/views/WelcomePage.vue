<template>
  <div class="about">
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-12">
          <button class="btn btn-outline-primary mt-3 action-button" @click="logout">
            <ph-user-circle-minus :size="20" />
            Logout
          </button>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div class="container">
        <div class="row justify-content-center mt-5">
          <div class="col-md-9">
            <div class="input-group">
              <input
                type="text"
                v-model="text"
                class="form-control"
                aria-label="Text input with checkbox"
                placeholder="What needs to be done? ʕ⁀ᴥ⁀ʔ"
              />
              <button class="btn btn-outline-primary ml-2 action-button" @click="onSave()" aria-label="Add"> <ph-upload :size="20"/> </button>
              
            </div>
          </div>
        </div>

        <div
          class="row justify-content-center mt-5"
          v-for="(item, index) in todoArray"
          :key="index"
        >
          <div class="col-md-9">
            <div class="input-group mb-3">
              <div class="input-group-prepend">
                <div class="input-group-text">
                  <input
                    type="checkbox"
                    v-model="deleteTodos"
                    :value="item.id"
                    aria-label="Checkbox for following text input"
                  />
                </div>
              </div>
              <input
                type="text"
                v-model="item.text"
                class="form-control"
                aria-label="Text input with checkbox"
                :class="[item.isChecked ? 'todo-is-done':'todo-is-not-done']"
              />
              <button class="btn btn-outline-primary ml-1 action-button" @click="onEdit(item)" aria-label="Edit"> <ph-pen :size="20"/></button>
              <button class="btn btn-outline-primary ml-1 action-button" @click="onDelete(item)" aria-label="Delete"> <ph-trash :size="20" /> </button>
              <button class="btn btn-outline-primary ml-1 action-button" @click="onEdit(item)" aria-label="Complete"><ph-check :size="20"/></button>
            </div>
          </div>
        </div>
        <div class="row" v-if="deleteTodos.length > 1">
          <div class="delete-bulk-button">
            <p class="delete-bulk-text"> Bulk Delete</p>
            <button 
              class="btn btn-outline-primary ml-1 "  
              @click="onDeleteBulk()" 
              aria-label="Delete-bulk"> <ph-file-x :size="48" /> </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import { PhTrash, PhUpload, PhPen, PhCheck, PhUserCircleMinus, PhFileX } from "phosphor-vue";
import axios from "axios";
import user from "../store/modules/user"
export default {
  methods: {
    ...mapActions("user", {
      logout: "logout",
    }),
    onSave() {
      
       console.log(user.state.user.username);
      let objRandom = { isChecked: false, text: this.text, user_name: JSON.parse(user.state.user).username };
      axios
        .post("/.netlify/functions/todos-create", objRandom)
        .then((response) => {})
        .catch((error) => {
          console.warn(error);
        })
        .finally(() => {
          this.todoArray = [];
          this.getAll();
        });
    },
    getAll() {
      axios
        .post("/.netlify/functions/todo-read-all",{user_name: JSON.parse(user.state.user).username})
        .then((response) => {
          this.todoArray.push(response.data);
          //this.todoArray.splice(0,this.todoArray.length,...response);
          this.todoArray.length = 0;
          response.data.forEach((element) => {
            this.todoArray.push({
              isChecked: element.data.isChecked,
              text: element.data.text,
              id: element.ref["@ref"].id,
            });
          });
        })
        .catch((error) => {
          //console.warn(error)
        })
        .finally(() => {
          console.log("Read Completed..");
        });
    },
    onEdit(todoItem) {
      console.warn("editing isChecked: ", todoItem.isChecked);
      console.warn("Not is: ", !todoItem.isChecked);
      console.table(todoItem);
      axios
        .post("/.netlify/functions/todos-update", {
          id: todoItem.id,
          text: todoItem.text,
          isChecked: !todoItem.isChecked,
        })
        .then((response) => {})
        .finally(() => {
          this.todoArray = [];
          this.getAll();
        });
    },
    onDelete(todoItem) {
      axios
        .post("/.netlify/functions/todos-delete", { id: todoItem.id })
        .then((response) => {
          console.log(response);
        })
        .finally(() => {
          this.todoArray = [];
          this.getAll();
        });
    },
    onDeleteBulk() {
      console.log(this.deleteTodos);
      axios
        .post("/.netlify/functions/todos-delete-batch", {
          ids: this.deleteTodos,
        })
        .then((response) => {
          console.log(response);
        })
        .finally(() => {
          console.log("Bulk todos deleted");
          this.getAll();
        });
    },
  },
  created() {
    
    this.getAll();
  },
  data: function () {
    return {
      todoArray: [],
      isChecked: false,
      text: "",
      deleteTodos: [],
    };
  },
  components:{
    PhTrash,
    PhUpload,
    PhPen,
    PhCheck,
    PhUserCircleMinus,
    PhFileX
  }
};
</script>

<style scoped>
.todo-is-done {
  text-decoration:line-through;
}

.todo-is-not-done {
  text-decoration: none;
}

body {
  background-image: url('../assets/Frame 1.png');
  background-repeat: no-repeat;
}



.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.action-button:hover{
  border: 1px black;
  background: yellowgreen;
}

.btn-outline-primary{
  color: green;
  border: 0px;
}

.delete-bulk-button {
  position: fixed;
  border-radius: 100%;
  bottom: 50px;
  right: 50px; 
  height: 100px;
  width: 100px;
}

.delete-bulk-button:hover {
  position: fixed;
  border-radius: 100%;
  height: 100px;
  width: 100px;
  bottom: 50px;
  right: 50px; 
}

.btn-outline-primary{
  background: white
}

.input-group-text{
  background-color: #a5c85c;
}

.delete-bulk-text{
  margin: 0;
  padding: 0;
}

.bounce-enter-active {
  animation: bounce-in 0.8s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}

.container{
  backdrop-filter: blur(2px);
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
