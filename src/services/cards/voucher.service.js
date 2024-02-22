/* eslint-disable no-useless-catch */
import { VoucherModel } from 'models/cards/voucher.model'
import { UserModels } from 'models/user.model'
import { fixObjectId } from 'utils/formatters'

const InvalidFields = ['_id', 'userId', 'createdAt', 'updatedAt']

const registerVoucher = async (userId, data) => {
  try {
    // check if voucher already exists
    const voucher = await VoucherModel.findOneByUserId(userId)
    if (voucher) throw new Error('Voucher already exists')

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

export const VoucherServices = {
  registerVoucher
}