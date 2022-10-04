<template>
  <div class="flex flex-col items-center pb-6">
    <h1
      class="font-medium leading-tight text-4xl border-2 border-cyan-300 p-3 m-3 text-center rounded-2xl"
    >
      Animal: Dog
    </h1>
    <div class="flex gap-5">
      <button class="btn btn-circle btn-outline btn-info">
        <font-awesome-icon icon="fa-thumbs-up" class="fa-2xl" />
      </button>
      <button class="btn btn-circle btn-outline btn-error">
        <font-awesome-icon icon="fa-thumbs-down" class="fa-2xl" />
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
};
</script>
