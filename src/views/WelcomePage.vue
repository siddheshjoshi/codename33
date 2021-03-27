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
        <div class="row justify-content-center mt-5 mb-5">
          <div class="col-md-9">
              Match#: {{matchForToday['S.No']}} <br />
              Match: {{matchForToday['Match Center']}} <br />
              Venue: {{matchForToday['Stadium']}}, {{matchForToday['City']}}
          </div>
          <div class="col-12 mt-4">
            <div class="row">
              <div class="col-6 prediction-box" style="min-height:90px;">
                {{playerSubmission.team}}
              </div>
              <div class="col-6 pl-4">
                <div class="row prediction-box mb-1" style="min-height:30px;">
                  {{playerSubmission.player1}}
                </div>
                <div class="row prediction-box mb-1" style="min-height:30px;">
                  {{playerSubmission.player2}}
                </div>
                <div class="row prediction-box mt-1" style="min-height:30px;">
                  {{playerSubmission.player3}}
                </div>
              </div>
            </div>
          </div>

        </div>
        <div class="row">
          <div class="col-6">
            <multiselect v-model="selected" :options="playersForTeam1" />
          </div>
          <div class="col-6">
            <multiselect v-model="selected" :options="playersForTeam2" />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { PhUserCircleMinus } from 'phosphor-vue'
import axios from 'axios'
import user from '../store/modules/user'

export default {
  methods: {
    ...mapActions('user', {
      logout: 'logout'
    }),
    async getMatchData () {
      const resp = await axios.get('/.netlify/functions/get-match-schedule')
      this.matchForToday = resp.data[0]
      const teamsArr = (this.matchForToday['Match Center'].split('Vs'))
      this.team1 = teamsArr[0].trim()
      this.team2 = teamsArr[1].trim()
      await this.setTeams()
    },
    async setTeams () {
      var params = { team: this.team1 }
      const team1 = await axios.post('/.netlify/functions/get-players', { body: params })
      params = { team: this.team2 }
      const team2 = await axios.post('/.netlify/functions/get-players', { body: params })
      this.playersForTeam1 = Object.values(team1.data.Players[0])
      this.playersForTeam2 = Object.values(team2.data.Players[0])
    }

  },
  created () {
    this.getMatchData()
  },
  data: function () {
    return {
      matchForToday: {},
      team1: '',
      team2: '',
      isTeamOneChecked: false,
      isTeamTwoChecked: false,
      playerSubmission: {
        team: 'Please tap on winning team',
        player1: 'Player 1',
        player2: 'Player 2',
        player3: 'Player 3'
      },
      playersForTeam1: [],
      playersForTeam2: [],
      selected: null

    }
  },
  components: {
    PhUserCircleMinus
  }
}
</script>

<style scoped>
.todo-is-done {
  text-decoration:line-through;
}

.todo-is-not-done {
  text-decoration: none;
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
  border-radius: 100%;
  bottom: 50px;
  right: 50px;
  height: 100px;
  width: 100px;
}

.delete-bulk-button:hover {
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

.prediction-box {
  background-color: #f8f8f8;
  color: #c5c5c5;
  align-items: center;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
