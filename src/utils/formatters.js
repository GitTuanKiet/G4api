import { ObjectId } from 'mongodb'

// slugify để tạo slug từ title
export const slugify = (text) => {
  if (!text) return ''
  return text
    .normalize('NFKD')
    .replace(/[\u0300-\u036F]/g, '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/[^\w-]+/g, '')
}

export const fixObjectId = (id) => {
  // if (typeof id !== 'string') return id
  if (!ObjectId.isValid(id)) return id
  // if (id.length !== 24) return id
  return new ObjectId(id)
}

export const fixString = (value) => {
  if (typeof value === 'string')
    return value.trim()
  return value.toString().trim()
}

export const VNDtoUSD = (vnd) => {
  return (vnd).toLocaleString('en', { style: 'currency', currency: 'USD' })
}