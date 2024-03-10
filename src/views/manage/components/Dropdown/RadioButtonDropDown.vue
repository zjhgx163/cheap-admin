<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ title + label }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="label" style="padding: 10px">
          <el-radio v-for="(item, index) in labels" :key="index" :label="item">
            {{ item }}
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  props: {
    value: {
      type: [String, Boolean],
    },
    labels: {
      type: Array,
    },
    title: {
      type: String,
    },
  },
  computed: {
    label: {
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
