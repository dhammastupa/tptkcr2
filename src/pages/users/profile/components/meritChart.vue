<template>
  <Line-Chart :chartData="meritData" />
</template>

<script>
import { LineChart } from 'vue-chart-3'
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

export default {
  components: { LineChart },

  setup () {
    const meritData = {
      labels: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
      datasets: [{
        label: 'Dataset 1',
        data: [10, 20, 30, 40, 90, 45, 22, 66, 89, 11, 33, 43]
      }]
    }
    return {
      meritData
    }
  }

}
</script>
