<template>
  <el-dropdown :show-timeout="100" trigger="click">
    <el-button plain>
      {{ title }} {{ label | getLabelText(that.labels) }}
      <i class="el-icon-caret-bottom el-icon--right" />
    </el-button>
    <el-dropdown-menu slot="dropdown" class="no-padding">
      <el-dropdown-item>
        <el-radio-group v-model="label" style="padding: 10px">
          <el-radio v-for="(item, index) in labels" :key="index" :label="item.value">
            {{ item.text }}
          </el-radio>
        </el-radio-group>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  data() {
    return {
      that: this,
    };
  },
  props: {
    value: {
      type: [String, Boolean, Number],
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
  filters: {
    getLabelText(value, labels) {
      // console.log(labels);
      let item = labels.filter((label) => {
        return label.value == value;
      });
      return item[0].text;
    },
  },
};
</script>
