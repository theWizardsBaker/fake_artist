<template>
  <section>
    HELLO
    <div v-if="createNewGame">
      New Game
    </div>
    <div class="mb-5" v-else>
        <label
          for="name"
          class="mb-3 block text-base font-medium text-[#07074D]"
        >
          Full Name
        </label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Full Name"
          class="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
        />
      </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      createNewGame: true,
      gameId: "",
    }
  },
}
</script>
