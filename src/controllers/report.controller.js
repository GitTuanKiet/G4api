import { OrderModels } from 'models/order.model'

function calculateTotalPriceByMonth(orders) {
  const totalPriceByMonth = {}

  // Loop through each order
  orders.forEach(order => {
    // Get the month and year of order's createdAt
    const month = order.createdAt.getMonth()
    const year = order.createdAt.getFullYear()

    // Create a key using month and year
    const key = `${year}-${month + 1}` // Adding 1 to month because getMonth() returns zero-based month

    // If the key doesn't exist in totalPriceByMonth, initialize it
    if (!totalPriceByMonth[key]) {
      totalPriceByMonth[key] = {
        month: month + 1,
        year: year,
        totalAmount: 0,
        orderCount: 0
      }
    }

    // Add order's price to the corresponding month
    totalPriceByMonth[key].totalAmount += order.price
    totalPriceByMonth[key].orderCount++
  })

  // Convert totalPriceByMonth object into an array of month objects
  const result = Object.values(totalPriceByMonth)

  // Sort the result array by month
  result.sort((a, b) => {
    // Compare years first
    if (a.year !== b.year) {
      return a.year - b.year
    }
    // If years are the same, compare months
    return a.month - b.month
  })

  return result
}

const ordersReport = async(req, res, next) =>
{
  try {
    const orders = await OrderModels.listOrders()
    const totalPriceByMonth = calculateTotalPriceByMonth(orders)

    return res.render('orders-report.ejs', { totalPriceByMonth })
  } catch (error) {
    next(error)
  }
}

export const ReportControllers = {
  ordersReport
}