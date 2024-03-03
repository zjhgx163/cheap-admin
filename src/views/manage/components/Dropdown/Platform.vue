<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ platform }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="platform" style="padding: 10px">
          <el-radio label="Yunpan"> Yunpan </el-radio>
          <el-radio label="Goods"> Goods </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: 'Yunpan',
    },
  },
  computed: {
    platform: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      },
    },
  },
};
</script>
