<template>
    <div>
        <canvas id="cutpointsCanvas" ref="cutpoints" :width="width" :height="height"></canvas>
    </div>
</template>

<script>
  export default {
    name: 'widget',
    data () {
      return {
        width: 200,
        height: 80
      }
    },
    props: {
      cutpoints: {
        type: Array,
        required: false
      }
    },
    created: function () {
      this.$nextTick(() => {
        window.addEventListener('resize', this.updateWidth)
      })
    },

    methods: {
      /**
       * Updates the width and redraws
       */
      updateWidth (event) {
        this.width = this.$el.clientWidth
        this.$nextTick(() => {
          this.draw()
        })
      }
    }

  }
</script>

