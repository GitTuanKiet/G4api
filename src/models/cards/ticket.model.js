/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const TicketCollection = 'tickets'

const schemaCreateTicket = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  orderId: Joi.string().required(),
  cinemaId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  showtimeId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  voucherId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  giftId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  chairIds: Joi.array().items(Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE)).required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  status: Joi.string().valid('used', 'unused', 'inactive').default('inactive'),
  createdAt: Joi.date().default(new Date())
})

/**
 * function validate data trước khi tạo mới
 * @param {*} data
 * @returns {Promise<ticket>}
 */
const validateTicket = async (data) => {
  try {
    return await schemaCreateTicket.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

/**
 * function fetch ticket theo userId
 * @param {*} userId
 * @returns {Promise<array<ticket>>}
 */
const fetchAllByUserId = async (userId) => {
  try {
    return await getMongo().collection(TicketCollection).find({ userId: fixObjectId(userId), status: { $in: ['used', 'unused'] } }).toArray()
  } catch (error) {
    throw error
  }
}

/**
 * function tạo mới ticket
 * @param {*} data
 * @returns {Promise<ticket>}
 */
const createTicket = async (data) => {
  try {
    const ticket = validateTicket(data)
    ticket.userId = fixObjectId(ticket.userId)
    ticket.cinemaId = fixObjectId(ticket.cinemaId)
    ticket.showtimeId = fixObjectId(ticket.showtimeId)
    ticket.voucherId = fixObjectId(ticket.voucherId)
    ticket.giftId = fixObjectId(ticket.giftId)
    ticket.chairIds = ticket.chairIds.map(fixObjectId)
    return await getMongo().collection(TicketCollection).insertOne(ticket)
  } catch (error) {
    throw error
  }
}

const updateStatusByOrderId = async (orderId, status) => {
  try {
    return await getMongo().collection(TicketCollection).updateOne({ orderId }, { $set: status })
  } catch (error) {
    throw error
  }
}

export const TicketModels = {
  validateTicket,
  fetchAllByUserId,
  createTicket,
  updateStatusByOrderId
}