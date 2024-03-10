/* eslint-disable no-useless-catch */

import { GiftModels } from 'models/cards/gift.model'
import { VoucherModels } from 'models/cards/voucher.model'
import { CouponModels } from 'models/cards/coupon.model'
import { TicketModels } from 'models/cards/ticket.model'

import { ShowtimeServices } from 'services/showtime.service'
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

const createCard = async (userId, order, data) => {
  try {
    // get price and delete from data
    const price = Number(data.price)
    delete data.order
    delete data.price
    delete data.currency
    delete data.return_url
    let cardData = {
      ...data,
      userId: userId
    }

    // switch case to create card
    switch (order) {
    case 'gift':
      cardData.value = price
      await GiftModels.createGift(cardData)
      return
    case 'voucher':
      cardData.discount = price
      await VoucherModels.createVoucher(cardData)
      return
    case 'coupon':
      // sẽ bổ sung sau
      await CouponModels.createCoupon(cardData)
      return
    case 'ticket':
      cardData.total = price
      await Promise.all([
        VoucherModels.updateStatusByOrderId(data?.voucherOrderId, { status: 'processing' }),
        GiftModels.updateStatusByOrderId(data?.giftOrderId, { status: 'processing' }),
        TicketModels.createTicket(cardData)
      ])
      return
    default:
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Invalid card type')
    }
  } catch (error) {
    throw error
  }
}
/**
 *
 * @param {*} orderId
 * @param {object} data - status, expiredAt
 * @returns
 */
const updateStatusActive = async (orderId, data) => {
  try {
    // update status of card
    await Promise.all([
      GiftModels.updateStatusByOrderId(orderId, data),
      VoucherModels.updateStatusByOrderId(orderId, data),
      CouponModels.updateStatusByOrderId(orderId, data),
      TicketModels.updateStatusByOrderId(orderId, data)
    ])

    // if card is ticket, push booked chairs and update status of voucher and gift used
    const ticket = await TicketModels.findByOrderId(orderId)

    if (ticket) {
      await Promise.all([
        ShowtimeServices.pushBookedChairs(ticket.showtimeId, ticket.chairs),
        VoucherModels.updateStatusByOrderId(ticket?.voucherOrderId, { status: 'used' }),
        GiftModels.updateStatusByOrderId(ticket?.giftOrderId, { status: 'used' })
      ])
    }

    return
  } catch (error) {
    throw error
  }
}

export const CardServices = {
  fetchAllByUserId,
  createCard,
  updateStatusActive
}