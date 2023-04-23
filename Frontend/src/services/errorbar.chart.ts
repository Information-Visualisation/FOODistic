import { Chart } from 'chart.js/auto'
import { createTypedChart } from 'vue-chartjs'
import { BarWithErrorBarsController, BarWithErrorBar } from 'chartjs-chart-error-bars'

Chart.register(BarWithErrorBarsController, BarWithErrorBar)

const BarWithErrorBarChart = createTypedChart(
    BarWithErrorBarsController.id as 'bar',
    BarWithErrorBarsController
);
  
export default BarWithErrorBarChart