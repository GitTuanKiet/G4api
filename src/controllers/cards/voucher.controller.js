import { StatusCodes } from 'http-status-codes'
import { VoucherServices } from 'services/cards/voucher.service'

const registerVoucher = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await VoucherServices.registerVoucher(_id, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const fetchAllByUserId = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await VoucherServices.fetchAllByUserId(_id)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const VoucherControllers = {
  registerVoucher,
  fetchAllByUserId
}