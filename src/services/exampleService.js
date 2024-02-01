/* eslint-disable no-useless-catch */
import { exampleModel } from 'models/exampleModel'

// những field không được phép update
const InvalidFields = ['_id', 'createdAt', 'updatedAt']

const createExample = async (data) => {
  try {
    return await exampleModel.createExample(data)
  } catch (error) {
    throw error
  }
}

const updateExample = async (id, data) => {
  try {
    const example = await exampleModel.findOneById(id)
    if (!example) throw Error('Example not found!')

    // lọc ra những field không được phép update
    const updateData = {}
    Object.keys(data).forEach((key) => {
      if (!InvalidFields.includes(key)) {
        updateData[key] = data[key]
      }
    })

    return await exampleModel.updateExample(id, updateData)
  } catch (error) {
    throw error
  }
}

const destroyExample = async (id) => {
  try {
    const example = await exampleModel.findOneById(id)
    if (!example) throw Error('Example not found!')

    return await exampleModel.destroyExample(id)
  } catch (error) {
    throw error
  }
}

export const exampleService = {
  createExample,
  updateExample,
  destroyExample
}