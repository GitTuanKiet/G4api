/* eslint-disable no-useless-catch */

import { exampleModel } from 'models/exampleModel'

// những field không được phép update
const InvalidFields = ['_id', 'createdAt', 'updatedAt']

const updateExample = async (id, data) => {
  try {
    const example = await exampleModel.findOneById(id)
    if (!example) throw new Error('Example not found!')

    // lọc ra những field không được phép update
    const updateData = {}
    Object.keys(data).forEach((key) => {
      if (!InvalidFields.includes(key)) {
        updateData[key] = data[key]
      }
    })

    return await exampleModel.updateExample(id, updateData)
  } catch (error) {
    next(error)
  }
}

export const exampleService = {
  updateExample
}