import Joi from 'joi'
import { getMongo } from 'utils/database/mongodb'
import { OBJECT_ID_REGEX, OBJECT_ID_MESSAGE } from 'utils/constants'
import { fixObjectId } from 'utils/formatters'
const MemberCardCollection = 'member cards'

const schemaCreateMemberCard = Joi.object({
  userId: Joi.string().pattern(OBJECT_ID_REGEX).message(OBJECT_ID_MESSAGE).required(),
  level: Joi.string().valid('iron', 'bronze', 'silver', 'gold', 'platinum').required(),
  point: Joi.number().default(0),
  registeredDate: Joi.string().isoDate().required(),
  number: Joi.string().required(),
  createdAt: Joi.date().default(new Date()),
  updatedAt: Joi.date().default(new Date())
})

const validateMemberCard = async (data) => await schemaCreateMemberCard.validateAsync(data, { abortEarly: false })
const findOneById = async (memberCardId) => await getMongo().collection(MemberCardCollection).findOne({ _id: fixObjectId(memberCardId) })
const findOneByUserId = async (userId) => await getMongo().collection(MemberCardCollection).findOne({ userId: fixObjectId(userId) })
const createMemberCard = async (data) => {
  const validatedData = await validateMemberCard(data)
  validatedData.userId = fixObjectId(validatedData.userId)

  return await getMongo().collection(MemberCardCollection).insertOne(validatedData)
}
const updateMemberCard = async (memberCardId, data) => await getMongo().collection(MemberCardCollection).findOneAndUpdate({ _id: fixObjectId(memberCardId) }, { $set: data }, { returnOriginal: false })
const deleteMemberCard = async (memberCardId) => await getMongo().collection(MemberCardCollection).deleteOne({ _id: fixObjectId(memberCardId) })

export const MemberCardModels = {
  findOneById,
  findOneByUserId,
  createMemberCard,
  updateMemberCard,
  deleteMemberCard
}
