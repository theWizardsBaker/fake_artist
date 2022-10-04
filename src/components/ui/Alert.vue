<template>
  <div class="alert shadow-lg">
    <div>
      <div>
        <slot name="content"></slot>
      </div>
    </div>
    <div class="flex-none">
      <slot name="action"></slot>
    </div>
  </div>
</template>
