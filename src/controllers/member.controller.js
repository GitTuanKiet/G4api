import { StatusCodes } from 'http-status-codes'
import { MemberCardServices } from 'services/member.service'

const getCard = async (req, res, next) => {
  try {
    const { _id } = req.user
    const memberCard = await MemberCardServices.getCard(_id)

    if (!memberCard) return
    return res.status(StatusCodes.OK).json(memberCard)
  } catch (error) {
    next(error)
  }
}

const registerMemberCard = async (req, res, next) => {
  try {
    const { _id } = req.user
    await MemberCardServices.registerMemberCard(_id, req.body)

    return res.status(StatusCodes.OK).json({ message: 'Register member card successfully' })
  } catch (error) {
    next(error)
  }
}

const lostMemberCard = async (req, res, next) => {
  try {
    const { _id } = req.user
    await MemberCardServices.lostMemberCard(_id)

    return res.status(StatusCodes.OK).json({ message: 'Lost member card successfully' })
  } catch (error) {
    next(error)
  }
}

export const MemberCardControllers = {
  getCard,
  registerMemberCard,
  lostMemberCard
}