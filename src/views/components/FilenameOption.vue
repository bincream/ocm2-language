<template>
  <div style="display:inline-block;">
    <label class="radio-label">{{ $t('alarmInfo.exclebiaoming') }}</label>
    <el-input
      v-model="filename"
      :placeholder="$t('alarmInfo.morenwei')"
      style="width:200px;"
      prefix-icon="el-icon-document"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  computed: {
    filename: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
<style>
.radio-label {
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  padding: 0 12px 0 30px;
}
</style>
