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

const validateTicket = async (data) => await schemaCreateTicket.validateAsync(data, { abortEarly: false })
const findByOrderId = async (orderId) => await getMongo().collection(TicketCollection).findOne({ orderId })
const fetchAllByUserId = async (userId) => await getMongo().collection(TicketCollection).find({ userId: fixObjectId(userId), status: { $in: ['used', 'active'] } }).toArray()
const createTicket = async (data) => {
  const ticket = await validateTicket(data)
  ticket.userId = fixObjectId(ticket.userId)
  ticket.showtimeId = fixObjectId(ticket.showtimeId)

  return await getMongo().collection(TicketCollection).insertOne(ticket)
}
const updateStatusByOrderId = async (orderId, status) => {
  if (status.expiredAt) delete status.expiredAt

  return await getMongo().collection(TicketCollection).updateOne({ orderId }, { $set: status })
}

export const TicketModels = {
  findByOrderId,
  validateTicket,
  fetchAllByUserId,
  createTicket,
  updateStatusByOrderId
}