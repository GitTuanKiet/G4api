import { PAYPAL_API, PAYPAL_AUTH } from 'utils/constants'

const getAuth = async () => {
  const response = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${PAYPAL_AUTH}`
    },
    body: 'grant_type=client_credentials'
  })
  return response.json()
}

export { getAuth }