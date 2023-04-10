import 'dotenv/config'

import axios, { AxiosError } from 'axios'
import data from '../data/payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const userList = async () => {
  return await axios.post(`${baseUrl}/graphql`, data, {
    headers: {
      Authorization: 'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjgxMTIzMTkyLCJleHAiOjE2ODEyOTU5OTJ9.2BDsOoLqFVCQTt4hB1y6az8fB4trn1xMqQ51LfEY3nA',
      "Content-Type": 'Application/json'
    }
  })

}