<template>
  <v-dialog
    v-model="dialog"
    :width="mobile ? '' : '500'"
    :fullscreen="mobile"
    transition="scale-transition"
    scrim="black"
  >
    <template v-slot:activator="{ props }">
      <v-btn color="primary" rounded="pill" variant="outlined" v-bind="props">Sign Up</v-btn>
    </template>
    <v-card class="py-2" :style="[mobile ? '' : 'border-radius: 18px']">
      <v-card-text class="text-h6 d-flex">
        Sign Up
        <v-spacer></v-spacer>
        <v-btn v-show="mobile" icon="mdi-close" variant="text" @click="dialog = false" height="32" width="32"></v-btn>
      </v-card-text>
      <v-card-text class="pt-2 pb-5">
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
          @submit.prevent="onSubmit"
          :readonly="loading"
        >
          <v-text-field
            variant="outlined"
            v-model="name"
            label="Name"
            :rules="nameRules"
            :counter="32"
            maxlength="32"
            density="compact"
            class="mb-2"
            @input="message=''"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="username"
            label="Username"
            prefix="@"
            :rules="usernameRules"
            :counter="32"
            maxlength="32"
            density="compact"
            class="mb-2"
            @input="message=''"
          >
            <template v-slot:append-inner>
              <v-fade-transition leave-absolute>
                <v-icon
                  v-if="usernameTaken"
                  icon="mdi-close"
                  color="error"
                  size="24"
                ></v-icon>
              </v-fade-transition>
            </template>
          </v-text-field>
          <v-text-field
            variant="outlined"
            v-model="password"
            label="Password"
            :type="show ? 'text': 'password'"
            :rules="passwordRules"
            density="compact"
            class="mb-2"
            @input="message=''"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
          ></v-text-field>
          <div v-show="message.length" class="mb-5 text-error">{{ message }}</div>
          <v-btn color="primary" rounded="pill" block :loading="loading" type="submit">Sign Up</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs';

const dialog = ref(false)
const { mobile } = useDisplay()
const form = ref(null)
const valid = ref(true)

const name = ref("")
const nameRules = [
  v => (v || "").length <= 32 || "Name cannot be longer than 32 characters"
]

const username = ref("")
const usernameLower = computed(() => username.value.toLowerCase())
const takenUsernames = ref(new Set())
const usernameTaken = computed(() => {
  return takenUsernames.value.has(usernameLower.value)
})
const usernameRules = [
  v => (v || "").length >= 3 || "Username must be at least 3 characters long",
  v => (v || "").length <= 32 || "Username cannot be longer than 32 characters",
  v => !!v.match(/^\w+$/) || "Letters, numbers, and underscores only",
  v => !takenUsernames.value.has(v.toLowerCase()) || "Username already taken", // or usernameLower.value, idk
]

const password = ref("")
const passwordRules = [
  () => !!password.value.length || "Password cannot be blank",
  // v => (v || "").length >= 8 || "Password must be at least 8 characters long",
]
const show = ref(false)

const loading = ref(false)
const message = ref("")

async function onSubmit() {
  const { valid } = await form.value.validate()
  if (!valid) return false
  loading.value = true
  const { data, error } = await useAuthFetch("/api/auth/user", {
    server: false,
    method: "POST",
    body: { name: name.value, username: username.value, password: password.value }
  })
  loading.value = false
  if (error.value) {
    switch (error?.value?.statusCode) {
      case 409:
        takenUsernames.value.add(usernameLower.value)
        form.value.validate()
        break
      case 500:
        message.value = "Oops, something went wrong. Please try again."
        break
      default:
        message.value = ""
    }
  } else {
    dialog.value = false
    await useNuxtApp().$auth.setUser(data.value)
    navigateTo("/profile")
  }
}
</script>
