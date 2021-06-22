<template>
<div>
  <!-- 面包屑导航区 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 2.为ECharts准备一个具备大小（宽高）的Dom -->
      <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
</div>
</template>

<script>
// 1.导入echarts
import echarts from 'echarts'
import lodash from 'lodash'

export default {
  data () {
    return {
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created () {},
  // 当生命周期函数执行到mounted时 页面上dom元素已经渲染完毕 所以此时初始化图表echarts
  async mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取图表失败！')
    }
    // 4.准备图表的数据和配置项 // 指定图表的配置项和数据 此处通过HTTP请求拿到了res.data数据 直接传给了setOption 所以不需要原始写的option数据了
    /* var option = {
      title: {
        text: '第一个 ECharts 实例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    } */
    const result = lodash.merge(this.options, res.data)
    // 5.使用刚指定的配置项和数据显示图表。展示数据
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang='less' scoped>

</style>
