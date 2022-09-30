<template>
  <section class="card w-96 bg-base-100 shadow-xl">
    <div class="card-body">
      <div class="flex flex-col w-full border-opacity-50">
        <div class="p-3">
          <div class="form-control w-full max-w-xs">
            <label class="label">
              <span class="label-text">Enter a code to join an existing game</span>
            </label>
            <input 
              type="text"
              placeholder="Game Code"
              class="input input-bordered input-lg text-3xl w-full max-w-xs mb-5"
            />
          </div>
          <button class="btn btn-primary btn-block text-lg">
            Join
          </button>
        </div>
        <div class="divider">OR</div>
        <div class="p-3">
          <button 
            :class="['btn btn-success btn-block text-lg', loading && 'loading']"
            @click="loading = true"
            :disabled="loading"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      createNewGame: true,
      gameId: "",
      loading: false,
    }
  },
}
</script>
