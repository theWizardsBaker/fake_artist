<template>
  <div class="modal modal-bottom sm:modal-middle">
    <div class="modal-box">
      <h3 class="font-bold text-lg">
        <slot name="title"></slot>
      </h3>
      <p class="py-4">
        <slot name="content"></slot>
      </p>
      <div class="modal-action">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>
</template>
