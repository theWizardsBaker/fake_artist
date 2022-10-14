<template>
  <nav
    class="
      sticky
      top-0
      z-50
      w-full
      flex
      flex-wrap
      items-center
      justify-between
      py-1
      bg-accent
      text-gray-500
      hover:text-base-300
      focus:text-base-300
      shadow-lg
    "
  >
    <div
      class="
        container-fluid
        w-full
        flex
        flex-wrap
        items-center
        justify-between px-3
      "
    >
      <div
        class="
          flex
          items-center
          text-gray-900
          hover:text-gray-900
          focus:text-gray-900
          mr-1
        "
      >
        <!-- title -->
        <slot name="title"></slot>
      </div>
      <slot name="right"></slot>
    </div>
  </nav>
</template>
