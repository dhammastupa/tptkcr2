<template>
  <div ref="draggableContainer" id="draggable-container">
    <div
      id="draggable-header"
      @mousedown="dragMouseDown"
      :style="{width: (screenWidth-120)+'px'}"
    >
      <slot name="header"></slot>
    </div>
    <slot name="main"></slot>
  </div>
</template>

<script>
export default {
  name: 'rulerBar',

  data: function () {
    return {
      screenWidth: 100,
      positions: {
        clientX: 0,
        clientY: 0,
        movementX: 0,
        movementY: 0
      }
    }
  },
  created () {
    this.screenWidth = screen.width
  },
  methods: {
    dragMouseDown: function (event) {
      event.preventDefault()
      // get the mouse cursor position at startup:
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      document.onmousemove = this.elementDrag
      document.onmouseup = this.closeDragElement
    },
    elementDrag: function (event) {
      event.preventDefault()
      this.positions.movementX = this.positions.clientX - event.clientX
      this.positions.movementY = this.positions.clientY - event.clientY
      this.positions.clientX = event.clientX
      this.positions.clientY = event.clientY
      // set the element's new position:
      this.$refs.draggableContainer.style.top = (this.$refs.draggableContainer.offsetTop - this.positions.movementY) + 'px'
      this.$refs.draggableContainer.style.left = (this.$refs.draggableContainer.offsetLeft - this.positions.movementX) + 'px'
    },
    closeDragElement () {
      document.onmouseup = null
      document.onmousemove = null
    }
  }
}
</script>

<style scoped>
#draggable-container {
  position: absolute;
  background: white;
  text-align: center;
  opacity: 0.4;
  cursor: pointer;
  z-index: 9;
  margin: auto;
  border: 1px solid grey;
  padding: 10px;
  top: 300px;
  left: 40px;
}
#draggable-header {
  z-index: 10;
}
</style>
