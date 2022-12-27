<template>
  <div>
    <v-dialog v-model="dialog" width="500" transition="scale-transition">
      <template v-slot:activator="{ props }">
        <v-btn rounded="pill" v-bind="props" class="mr-3">Login</v-btn>
      </template>
      <v-card class="py-2" style="border-radius: 30px">
        <v-card-text class="text-h6">Login</v-card-text>
        <v-card-text class="pt-2 pb-5">
          <v-form ref="form" @submit.prevent="onSubmit" :readonly="loading">
            <v-text-field
              variant="outlined"
              v-model="username"
              label="Username"
              prefix="@"
              maxlength="32"
              @input="message=''"
              density="compact"
              class="mb-1"
            ></v-text-field>
            <v-text-field
              variant="outlined"
              v-model="password"
              label="Password"
              type="password"
              @input="message=''"
              density="compact"
              class="mb-2"
            ></v-text-field>
            <div v-show="message.length" class="mb-5 text-error">{{ message }}</div>
            <v-btn color="primary" rounded="pill" block :loading="loading" type="submit">Login</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
  const dialog = ref(false)
  const form = ref(null)
  const username = ref("")
  const password = ref("")
  const loading = ref(false)
  const message = ref("")

  async function onSubmit() {
    loading.value = true
    if (!username.value.match(/\w{3,32}/) || password.value.length === 0) {
      message.value = "Username or password incorrect"
      return false
    }
    const { data } = await useFetch("/api/user", {
      method: "GET",
      params: { username: username.value, password: password.value }
    })
    loading.value = false
    console.log(data.value)
  }
</script>
