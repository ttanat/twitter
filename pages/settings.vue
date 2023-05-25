<template>
  <BaseLayout>
    <div class="pa-5">
      <v-card class="mx-auto px-6 py-8 mb-5">
        <v-form
          ref="nameForm"
          @submit.prevent="onSubmitNameForm"
          :disabled="nameFormLoading"
        >
          <v-text-field
            variant="outlined"
            v-model="name"
            label="Change name"
            :rules="nameRules"
            :counter="32"
            maxlength="32"
            density="compact"
            class="mb-2"
          ></v-text-field>
          <v-btn
            color="blue-darken-3"
            size="small"
            type="submit"
            variant="elevated"
            :loading="nameFormLoading"
          >
            Change name
          </v-btn>
        </v-form>
        <ClientOnly>
          <v-snackbar v-model="nameSnackbar" :timeout="3000" :color="nameSnackbarColor" rounded="pill">{{ nameSnackbarMessage }}</v-snackbar>
        </ClientOnly>
      </v-card>
      <v-card class="mx-auto px-6 py-8 mb-5">
        <v-form
          ref="passwordForm"
          @submit.prevent="onSubmitPasswordForm"
        >
          <v-text-field
            variant="outlined"
            v-model="oldPassword"
            label="Old password"
            type="password"
            density="compact"
            class="mb-2"
          ></v-text-field>
          <v-text-field
            variant="outlined"
            v-model="newPassword"
            label="New password"
            :type="show ? 'text': 'password'"
            :rules="passwordRules"
            density="compact"
            class="mb-2"
            :append-inner-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="show = !show"
          ></v-text-field>
          <v-btn
            color="blue-darken-3"
            size="small"
            type="submit"
            variant="elevated"
            :loading="passwordFormLoading"
          >
            Change password
          </v-btn>
          <ClientOnly>
            <v-snackbar v-model="passwordSnackbar" :timeout="3000" :color="passwordSnackbarColor" rounded="pill">{{ passwordSnackbarMessage }}</v-snackbar>
          </ClientOnly>
        </v-form>
      </v-card>
      <v-card class="mx-auto px-6 py-8 mb-5">
        <v-form
          ref="privacyForm"
          @submit.prevent="onSubmitPrivacyForm"
          :disabled="privacyFormLoading || loadingPrivacy"
        >
          <v-switch
            v-model="privacy"
            label="Private account"
            color="blue-darken-3"
            :loading="loadingPrivacy ? 'warning' : false"
          ></v-switch>
          <v-btn
            color="blue-darken-3"
            size="small"
            type="submit"
            variant="elevated"
            :loading="privacyFormLoading"
            :disabled="loadingPrivacy"
          >
            Change privacy
          </v-btn>
          <ClientOnly>
            <v-snackbar v-model="privacySnackbar" :timeout="3000" :color="privacySnackbarColor" rounded="pill">{{ privacySnackbarMessage }}</v-snackbar>
          </ClientOnly>
        </v-form>
      </v-card>
    </div>
  </BaseLayout>
</template>

<script setup>
definePageMeta({ middleware: ["auth"] })
useHead({ title: "Settings" })
useState("navBarRoute").value = "Settings"

const nameForm = ref(null)
const nameFormLoading = ref(false)
const name = ref("")
const nameRules = [
  v => (v || "").length <= 32 || "Name cannot be longer than 32 characters",
  v => (v || "").length > 0 || "Name must contain at least 1 character",
]
const nameSnackbar = ref(false)
const nameSnackbarColor = ref("")
const nameSnackbarMessage = ref("")

async function onSubmitNameForm() {
  const { valid } = await nameForm.value.validate()
  if (!valid) return false
  nameFormLoading.value = true
  const { error } = await useApiFetch("/api/settings/name", {
    server: false,
    method: "POST",
    body: { name: name.value },
  })
  if (error.value) {
    nameSnackbarColor.value = "red"
    nameSnackbarMessage.value = "Oops, something went wrong."
  } else {
    nameForm.value.reset()
    nameSnackbarColor.value = "success"
    nameSnackbarMessage.value = "Name changed successfully."
  }
  nameSnackbar.value = true
  nameFormLoading.value = false
}

const passwordForm = ref(null)
const passwordFormLoading = ref(false)
const oldPassword = ref("")
const newPassword = ref("")
const passwordRules = [
  () => !!newPassword.value.length || "Password cannot be blank",
  // v => (v || "").length >= 8 || "Password must be at least 8 characters long",
]
const show = ref(false)
const passwordSnackbar = ref(false)
const passwordSnackbarColor = ref("")
const passwordSnackbarMessage = ref("")

async function onSubmitPasswordForm() {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return false
  passwordFormLoading.value = true
  const { error } = await useApiFetch("/api/settings/password", {
    server: false,
    method: "POST",
    body: { oldPassword: oldPassword.value, newPassword: newPassword.value },
  })
  if (error.value) {
    passwordSnackbarColor.value = "red"
    passwordSnackbarMessage.value = error.value.statusCode === 401 ? "Password incorrect" : "Oops, something went wrong."
  } else {
    passwordForm.value.reset()
    passwordSnackbarColor.value = "success"
    passwordSnackbarMessage.value = "Password changed successfully."
  }
  passwordSnackbar.value = true
  passwordFormLoading.value = false
}

const privacyForm = ref(null)
const privacyFormLoading = ref(false)
const privacy = ref(false)
// Load current privacy setting
const { pending: loadingPrivacy } = await useApiFetch("/api/settings/privacy", {
  onResponse({ response }) {
    privacy.value = response._data.isPrivate
  }
})
const privacySnackbar = ref(false)
const privacySnackbarColor = ref("")
const privacySnackbarMessage = ref("")

async function onSubmitPrivacyForm() {
  const { error } = await useApiFetch("/api/settings/privacy", {
    server: false,
    method: "POST",
    body: { privacy: privacy.value },
  })
  if (error.value) {
    privacySnackbarColor.value = "red"
    privacySnackbarMessage.value = "Oops, something went wrong."
  } else {
    privacySnackbarColor.value = "success"
    privacySnackbarMessage.value = "Privacy setting changed successfully."
  }
  privacySnackbar.value = true
  privacyFormLoading.value = false
}
</script>
