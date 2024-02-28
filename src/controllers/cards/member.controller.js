import { StatusCodes } from 'http-status-codes'
import { MemberCardServices } from 'services/cards/member.service'


const registerMemberCard = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await MemberCardServices.registerMemberCard(_id, req.body)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

const lostMemberCard = async (req, res, next) => {
  try {
    const { _id } = req.user
    const result = await MemberCardServices.lostMemberCard(_id)

    return res.status(StatusCodes.OK).json(result)
  } catch (error) {
    next(error)
  }
}

export const MemberCardControllers = {
  registerMemberCard,
  lostMemberCard
}