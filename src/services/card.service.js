/* eslint-disable no-useless-catch */

import { GiftModels } from 'models/cards/gift.model'
import { VoucherModels } from 'models/cards/voucher.model'
import { CouponModels } from 'models/cards/coupon.model'
import { TicketModels } from 'models/cards/ticket.model'

import { fixObjectId } from 'utils/formatters'
import ApiError from 'utils/ApiError'
import { StatusCodes } from 'http-status-codes'

const fetchAllByUserId = async (userId) => {
  try {
    const [gifts, vouchers, coupons, tickets] = await Promise.all([
      GiftModels.fetchAllByUserId(userId),
      VoucherModels.fetchAllByUserId(userId),
      CouponModels.fetchAllByUserId(userId),
      TicketModels.fetchAllByUserId(userId)
    ])

    return { gifts, vouchers, coupons, tickets }
  } catch (error) {
    throw error
  }
}

const createCard = async (userId, type, data) => {
  try {
    delete data.type
    delete data.return_url
    let cardData = {
      ...data,
      userId: userId
    }

    switch (type) {
    case 'gift':
      cardData = {
        ...cardData,
        value: Number(cardData.price)
      }
      delete cardData.price
      return await GiftModels.createGift(cardData)
    case 'voucher':
      cardData = {
        ...cardData,
        discount: Number(cardData.price)
      }
      delete cardData.price
      return await VoucherModels.createVoucher(cardData)
    case 'coupon':
      // sẽ bổ sung sau
      return await CouponModels.createCoupon(cardData)
    case 'ticket':
      // xử lí voucher và gift
      return await TicketModels.createTicket(cardData)
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid card type')
    }
  } catch (error) {
    throw error
  }
}

const updateStatusByOrderId = async (orderId, status) => {
  try {
    await Promise.all([
      GiftModels.updateStatusByOrderId(orderId, status),
      VoucherModels.updateStatusByOrderId(orderId, status),
      CouponModels.updateStatusByOrderId(orderId, status),
      TicketModels.updateStatusByOrderId(orderId, status)
    ])

  } catch (error) {
    throw error
  }
}

export const CardServices = {
  fetchAllByUserId,
  createCard,
  updateStatusByOrderId
}