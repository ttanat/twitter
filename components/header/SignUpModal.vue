<template>
  <div>
    <v-dialog v-model="dialog" width="500" transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-btn color="primary" rounded="pill" v-bind="props">Sign Up</v-btn>
      </template>
      <v-card class="py-2" style="border-radius: 30px">
        <v-card-text class="text-h6">Sign Up</v-card-text>
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
              label="Name (Optional)"
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
              type="password"
              :rules="[() => password.length || 'Password cannot be blank']"
              density="compact"
              class="mb-2"
              @input="message=''"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="confirmPassword"
              label="Confirm Password"
              type="password"
              :rules="[v => v === password || 'Password does not match']"
              density="compact"
              class="mb-2"
              @input="message=''"
            ></v-text-field>
            <div v-show="message.length" class="mb-5 text-red">{{ message }}</div>
            <v-btn color="primary" rounded="pill" block :loading="loading" type="submit">Sign Up</v-btn>
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
  const takenUsernames = ref(new Set())
  const usernameTaken = computed(() => {
    return takenUsernames.value.has(username.value)
  })
  const usernameRules = [
    v => (v || "").length >= 3 || "Username must be at least 3 characters",
    v => (v || "").length <= 32 || "Username must be less than 32 characters",
    v => !!v.match(/^\w+$/) || "Letters, numbers, and underscores only",
    v => !takenUsernames.value.has(v) || "Username already taken",
  ]

  const password = ref("")
  const confirmPassword = ref("")

  const loading = ref(false)
  const message = ref("")

  async function onSubmit() {
    loading.value = true
    const { data, error } = await useFetch("/api/user", {
      server: false,
      method: "POST",
      body: { username: username.value, password: password.value }
    })
    loading.value = false
    if (error) {
      switch (error?.value?.statusCode) {
        case 409:
          takenUsernames.value.add(username.value)
          form.value.validate()
          break
        case 500:
          message.value = "Oops, something went wrong. Please try again."
          break
        default:
          message.value = ""
      }
    } else {
      console.log(data.value)
    }
  }
</script>
