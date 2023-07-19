<template>
  <div class="modal" v-if="isOpen">
    <div class="modal-content">
      <button @click="handleClose">&times;</button>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
  position: fixed;
  display: flex;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
}

.modal-content {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  background-color: white;
  border-radius: 5px;
  position: relative;
  padding: 25px;
}

button {
  position: absolute;
  font-size: 22px;
  right: 8px;
  top: 8px;
}
</style>
