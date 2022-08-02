<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://speakly.org/media/logo.svg"
          transition="scale-transition"
          width="40"
        />

        <h2>Speakly</h2>
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Info</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <Chat/>
    </v-main>
  </v-app>
</template>

<script>
import Chat from './components/Chat';

export default {
  name: 'App',

  components: {
    Chat,
  },

  data: () => ({
    //
  }),
};
</script>
