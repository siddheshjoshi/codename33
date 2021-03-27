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
          <div v-if="errorText" class="alert alert-danger col-12" role="alert">
            {{errorText}}
          </div>
          <div class="col-md-9">
              Match#: {{matchForToday['S.No']}} <br />
              Match: {{matchForToday['Match Center']}} <br />
              Venue: {{matchForToday['Stadium']}}, {{matchForToday['City']}}
          </div>

          <div class="col-12 mt-4">
            <div class="row px-md-0 px-3">
              <div
              class="col-6 prediction-box"
              style="min-height:90px;"
              :class="cssObject.teamAdded ? 'added-team-styling':''"
              >
                {{playerSubmission.team}}
              </div>
              <div class="col-6 pl-4">
                <div class="row prediction-box mb-1"
                style="min-height:30px;"
                :class="playerSubmission.selectedPlayers[0] && playerSubmission.selectedPlayers[0].length > 0 ? 'added-team-styling':''">
                  <div v-if="playerSubmission.selectedPlayers[0] && playerSubmission.selectedPlayers[0].length > 0">
                    {{playerSubmission.selectedPlayers[0]}}
                  </div>
                  <div v-else>
                    {{playerSubmission.placeholderPlayer1}}
                  </div>
                </div>
                <div class="row prediction-box mb-1" style="min-height:30px;"
                :class="playerSubmission.selectedPlayers[1] && playerSubmission.selectedPlayers[1].length > 0 ? 'added-team-styling':''">
                  <div v-if="playerSubmission.selectedPlayers[1] && playerSubmission.selectedPlayers[1].length > 0">
                    {{playerSubmission.selectedPlayers[1]}}
                  </div>
                  <div v-else>
                    {{playerSubmission.placeholderPlayer2}}
                  </div>
                </div>
                <div class="row prediction-box mt-1" style="min-height:30px;"
                :class="playerSubmission.selectedPlayers[2] && playerSubmission.selectedPlayers[2].length > 0 ? 'added-team-styling':''">
                  <div v-if="playerSubmission.selectedPlayers[2] && playerSubmission.selectedPlayers[2].length > 0">
                    {{playerSubmission.selectedPlayers[2]}}
                  </div>
                  <div v-else>
                    {{playerSubmission.placeholderPlayer3}}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-12">
            <div class="row float-right">
              <button class="btn btn-link" @click="submit()">submit</button>
              <button class="btn btn-link" @click="clearSelection()">clear all</button>
            </div>
          </div>

        </div>

        <div class="row">
          <div class="col-md-6 col-12">
            <div class="row mb-5">
              <div class="col-12">
                <multiselect v-model="selectedTeam" :options="teams" :searchable="false" />
              </div>
              <div class="col-6 mt-2">
                <button class="btn btn-outline-primary" @click="add('team')">ADD TEAM</button>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-6 col-12 mb-md-0 mb-4">
            <div class="row">
              <div class="col-10">
                <multiselect :searchable="false" v-model="selectedFromTeam1" :options="playersForTeam1" />
              </div>
              <div class="col-2 px-0 ">
                <button class="btn btn-outline-primary" @click="add('fromTeam1')">ADD </button>
              </div>
            </div>
          </div>
          <div class="col-md-6 col-12 mb-4">
            <div class="row">
              <div class="col-10">
                <multiselect :searchable="false" v-model="selectedFromTeam2" :options="playersForTeam2" />
              </div>
              <div class="col-2 px-0">
                <button class="btn btn-outline-primary" @click="add('fromTeam2')">ADD </button>
              </div>
            </div>
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
    clearSelection () {
      this.cssObject.teamAdded = false
      this.playerSubmission.selectedPlayers = []
      this.playerSubmission.team = 'Please tap on winning team'
      this.playerSubmission.placeholderPlayer1 = 'Player 1'
      this.playerSubmission.placeholderPlayer2 = 'Player 2'
      this.playerSubmission.placeholderPlayer3 = 'Player 3'
    },
    submit () {
      if (!this.playerSubmission.selectedPlayers || this.playerSubmission.selectedPlayers.length < 2 || this.playerSubmission.team === 'Please tap on winning team') {
        this.setError('Please select player nominations and winning team.')
      } else {
        delete this.playerSubmission.placeholderPlayer1
        delete this.playerSubmission.placeholderPlayer2
        delete this.playerSubmission.placeholderPlayer3
        console.log(this.playerSubmission)
      }
    },
    async getMatchData () {
      const resp = await axios.get('/.netlify/functions/get-match-schedule')
      this.matchForToday = resp.data[0]
      const teamsArr = (this.matchForToday['Match Center'].split('Vs'))
      this.teams.push(teamsArr[0].trim())
      this.teams.push(teamsArr[1].trim())
      await this.setTeams()
    },
    async setTeams () {
      var params = { team: this.teams[0] }
      const team1 = await axios.post('/.netlify/functions/get-players', { body: params })
      params = { team: this.teams[1] }
      const team2 = await axios.post('/.netlify/functions/get-players', { body: params })
      this.playersForTeam1 = Object.values(team1.data.Players[0])
      this.playersForTeam2 = Object.values(team2.data.Players[0])
    },
    setError (text) {
      this.errorText = text
      setTimeout(() => {
        this.errorText = ''
      }, 3000)
    },
    add (from) {
      if (from === 'team') {
        this.playerSubmission.team = this.selectedTeam
        this.cssObject.teamAdded = true
      }

      if (this.playerSubmission.selectedPlayers.length === 3 && from !== 'team') {
        this.setError('Can only select 3. Please clear selection and add again')
      } else {
        if (from === 'fromTeam1') {
          this.playerSubmission.selectedPlayers.push(this.selectedFromTeam1)
        } else if (from === 'fromTeam2') {
          this.playerSubmission.selectedPlayers.push(this.selectedFromTeam2)
        }
      }
    }
  },
  created () {
    this.getMatchData()
  },
  data: function () {
    return {
      matchForToday: {},
      teams: [],
      isTeamOneChecked: false,
      isTeamTwoChecked: false,
      playerSubmission: {
        team: 'Please tap on winning team',
        placeholderPlayer1: 'Player 1',
        placeholderPlayer2: 'Player 2',
        placeholderPlayer3: 'Player 3',
        selectedPlayers: []
      },
      playersForTeam1: [],
      playersForTeam2: [],
      selectedFromTeam1: null,
      selectedFromTeam2: null,
      selectedTeam: null,
      errorText: '',
      cssObject: {}

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

.added-team-styling {
    background-color: #313131;
    color: #dbdbff;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
