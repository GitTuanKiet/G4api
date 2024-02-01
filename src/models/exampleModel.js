/* eslint-disable no-useless-catch */

// Joi là một thư viện validate dữ liệu giống như Yup
import Joi from 'joi'

// gọi hàm getMongo để lấy dbInstance
import { getMongo } from 'config/mongodb'

//hàm fixObjectId
import { fixObjectId } from 'utils/formatters'

const NameExampleCollection = 'example'

// định nghĩa schema cho collection example
const schemaCreateExample = Joi.object({
  // name: Joi.string().required(),
  // description: Joi.string().required()
})

// validate data với schemaCreateExample
const validateExample = async (data) => {
  try {
    return await schemaCreateExample.validateAsync(data, { abortEarly: false })
  } catch (error) {
    throw error
  }
}

// ví dụ hàm tìm theo id
const findOneById = async (id) => {
  try {
    return await getMongo().collection(NameExampleCollection).findOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

// ví dụ hàm tạo mới
const createExample = async (data) => {
  try {
    const value = await validateExample(data)
    return await getMongo().collection(NameExampleCollection).insertOne(value)
  } catch (error) {
    throw error
  }
}

// ví dụ hàm cập nhật theo id
const updateExample = async (id, data) => {
  try {
    const value = await validateExample(data)
    return await getMongo().collection(NameExampleCollection).findOneAndUpdate(
      { _id: fixObjectId(id) }, { $set: value }, { returnOriginal: false })
  } catch (error) {
    throw error
  }
}

// ví dụ hàm xóa theo id
const destroyExample = async (id) => {
  try {
    return await getMongo().collection(NameExampleCollection).deleteOne({ _id: fixObjectId(id) })
  } catch (error) {
    throw error
  }
}

// export các hàm để sử dụng ở controller
export const exampleModel = {
  findOneById,
  createExample,
  updateExample,
  destroyExample
}
