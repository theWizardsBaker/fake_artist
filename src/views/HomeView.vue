<template>
  <main>
    <div class="hero min-h-screen bg-base-200">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-5xl font-bold handwriting py-5">Hidden Artist</h1>          
          <game-entry />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
  import GameEntry from "@/components/GameEntry.vue"

  export default {
    name: "Home Page",
    components: { GameEntry }
  }
</script>