/* eslint-disable no-useless-catch */
import { VoucherModel } from 'models/cards/voucher.model'
import { UserModels } from 'models/user.model'
import { fixObjectId } from 'utils/formatters'

const InvalidFields = ['_id', 'userId', 'createdAt', 'updatedAt']

const registerVoucher = async (userId, data) => {
  try {
    // lấy _id từ inserted
    const newVoucher = { userId: userId, ...data }
    const inserted = await VoucherModel.createVoucher(newVoucher)

    // push voucherId to user
    await UserModels.pushVoucherIds(userId, fixObjectId(inserted._id))
    return inserted
  } catch (error) {
    throw error
  }
}

const fetchAllByUserId = async (userId) => {
  try {
    return await VoucherModel.fetchAllByUserId(userId)
  } catch (error) {
    throw error
  }
}

export const VoucherServices = {
  registerVoucher,
  fetchAllByUserId
}