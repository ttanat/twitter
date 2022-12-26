<template>
  <div>
    <v-dialog v-model="dialog" width="500" transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" rounded="pill" v-bind="props">Sign Up</v-btn>
      </template>
      <v-card>
        <v-card-text>Sign Up</v-card-text>
        <v-card-text class="pb-5">
          <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="onSubmit">
            <v-text-field
              variant="outlined"
              v-model="name"
              label="Name"
              :rules="nameRules"
              :counter="32"
              maxlength="32"
              :readonly="loading"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="username"
              label="Username"
              prefix="@"
              :loading="checkingTakenUsername"
              :rules="usernameRules"
              :counter="32"
              maxlength="32"
              :readonly="loading"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="password"
              label="Password"
              type="password"
              :rules="[() => password.length || 'Password cannot be blank']"
              :readonly="loading"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              :rules="[v => v === password || 'Password does not match']"
              :readonly="loading"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <div v-show="message.length" class="mb-5 text-red">{{ message }}</div>
            <v-btn color="primary" block :loading="loading" type="submit">Sign Up</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  const dialog = ref(false)
  const form = ref(null)
  const valid = ref(true)
  const name = ref("")
  const nameRules = [
    v => (v || "").length <= 32 || "Name must be less than 32 characters"
  ]
  const username = ref("")
  const checkingTakenUsername = ref(false)
  const takenUsernames = new Set()
  const usernameRules = [
    v => (v || "").length >= 3 || "Username must be at least 3 characters",
    v => (v || "").length <= 32 || "Username must be less than 32 characters",
    v => !!v.match(/^\w{1,32}$/) || "Letters, numbers, and underscores only",
    v => !takenUsernames.has(v) || "Username already taken",
  ]
  const password = ref("")
  const confirmPassword = ref("")
  const loading = ref(false)
  const message = ref("")

  function onSubmit() {
    setTimeout(() => {
      takenUsernames.add("abc")
      console.log(form.value)
      form.value.validate()
    }, 1000)
  }
</script>
