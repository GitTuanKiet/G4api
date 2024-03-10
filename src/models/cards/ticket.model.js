/* eslint-disable no-useless-catch */
import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'

const TicketCollection = 'tickets'

const schemaCreateTicket = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  showtimeId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  name: Joi.string().required(),
  orderId: Joi.string().required(),
  voucherOrderId: Joi.string(),
  giftOrderId: Joi.string(),
  chairs: Joi.array().items(Joi.string()).required(),
  description: Joi.string().required(),
  status: Joi.string().valid('used', 'processing', 'active', 'inactive').default('inactive'),
  total: Joi.number().required(),
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
 * function find by orderId
 * @param {*} orderId
 * @returns {Promise<ticket>}
 */
const findByOrderId = async (orderId) => {
  try {
    return await getMongo().collection(TicketCollection).findOne({ orderId })
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
    return await getMongo().collection(TicketCollection).find({ userId: fixObjectId(userId), status: { $in: ['used', 'active'] } }).toArray()
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
    const ticket = await validateTicket(data)
    ticket.userId = fixObjectId(ticket.userId)
    ticket.showtimeId = fixObjectId(ticket.showtimeId)
    return await getMongo().collection(TicketCollection).insertOne(ticket)
  } catch (error) {
    throw error
  }
}

const updateStatusByOrderId = async (orderId, status) => {
  if (!orderId) return
  if (status.expiredAt) delete status.expiredAt
  try {
    return await getMongo().collection(TicketCollection).updateOne({ orderId }, { $set: status })
  } catch (error) {
    throw error
  }
}

export const TicketModels = {
  findByOrderId,
  validateTicket,
  fetchAllByUserId,
  createTicket,
  updateStatusByOrderId
}