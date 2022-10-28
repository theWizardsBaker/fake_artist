<template>
  <nav
    class="sticky top-0 z-50 w-full flex flex-wrap items-center justify-between py-1 bg-accent shadow-lg"
  >
    <div class="w-full flex flex-wrap justify-center sm:justify-between px-3">
      <div
        class="flex items-center text-accent-content hover:text-accent-content focus:text-accent-content mr-1 pb-4 sm:pb-0"
      >
        <!-- title -->
        <slot name="title"></slot>
      </div>
      <div class="flex items-right gap-2">
        <slot name="right"></slot>
      </div>
    </div>
  </nav>
</template>
