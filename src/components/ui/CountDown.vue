<template>
  <div
    :class="[
      'fixed z-90 md:bottom-8 bottom-16 right-6 radial-progress bg-accent text-accent-content border-4 border-accent text-4xl',
      this.countDown <= 5 && 'bg-error border-error',
    ]"
    :style="{ '--value': +radialValue, '--size': '4rem' }"
  >
    {{ countDown || timeLimit }}
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
  props: {
    start: {
      type: Boolean,
      default: false,
    },
    stop: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    ...mapState({
      timeLimit: (state) => state.game.timeLimit,
    }),
  },

  watch: {
    start(newVal) {
      this.startCountDown();
    },
    countDown(newVal, oldVal) {
      if (newVal !== oldVal && newVal == 0) {
        this.$emit("done");
        clearInterval(this.countDownInterval);
        console.log("DONE!");
      }
    },
  },

  data() {
    return {
      countDown: 0,
      countDownInterval: null,
      radialValue: 100,
    };
  },

  methods: {
    startCountDown() {
      this.countDown = this.timeLimit;
      // start the timeout
      this.countDownInterval = setInterval(() => {
        this.countDown -= 1;
        this.setRadialValue();
      }, 1000);
    },

    setRadialValue() {
      const tick = 100 / this.timeLimit;
      const countDown = this.timeLimit - (this.timeLimit - this.countDown);
      this.radialValue = countDown * tick;
    },
  },
};
</script>
