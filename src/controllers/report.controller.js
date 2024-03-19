import { OrderModels } from '../models/order.model'


const financialReport = async(req, res) =>
{
  // res.render('financial-report.ejs')
}

const ordersReport = async(req, res) =>
{
  const orders = await OrderModels.listOrders()
  const totalPriceByMonth = OrderModels.calculateTotalPriceByMonth(orders)

  res.render('orders-report.ejs', { totalPriceByMonth })
}

export const ReportControllers = {
  financialReport,
  ordersReport
}