import { StatusCodes } from 'http-status-codes'
import { VoucherServices } from 'services/cards/voucher.service'

const registerVoucher = async (req, res, next) => {
  try {
    const { userId } = req.user
    const result = await VoucherServices.registerVoucher(userId, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const VoucherControllers = {
  registerVoucher
}