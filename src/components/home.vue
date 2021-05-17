<template>
<div >
  <el-button type='info' @click="backForm">退出</el-button>
</div>
</template>

<script>
export default {
  name: '',
  filters: {},
  components: {},
  mixins: [],
  data() {
    return {}
  },
  computed: {},
  watch: {},
  beforeCreate() {},
  created() {
  },
  beforeMount() {},
  mounted() {
  },
  beforeUpdate() {},
  updated () {},
  beforeDestroy() {},
  destroyed() {},
  activated() {},
  methods: {
    backForm() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
