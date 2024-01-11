<template>
  <div :class="`card ${disabled ? 'disabled' : ''}`">
    <div class="left-icon"></div>
    <div class="card-content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss">
.card {
  background: #f6fafe;
  border-radius: 4px;
  border: 1px solid #a9cdf5;
  padding: 24px;
  position: relative;

  &.disabled {
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
    filter: progid:DXImageTransform.Microsoft.BasicImage(grayscale=1);
  }

  .left-icon {
    width: 4px;
    height: 56px;
    background: #569ded;
    border-radius: 0px 4px 4px 0px;
    position: absolute;
    left: -1px;
    top: 0;
    bottom: 0;
    margin: auto;
  }

  .card-content {
    width: 100%;
  }
}
</style>