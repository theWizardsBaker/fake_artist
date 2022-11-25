<template>
  <div class="static">
    <div class="absolute alert shadow-lg bottom-24 right-0">
      <div>
        <font-awesome-icon icon="fa-paintbrush" />
      </div>
      <div class="flex-none">
        <span><slot name="body"></slot></span>
      </div>
    </div>
  </div>
</template>
