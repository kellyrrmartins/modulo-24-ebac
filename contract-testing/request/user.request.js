import 'dotenv/config'
import axios from 'axios'
import data from '../data/payload.json'

const baseUrl = `http://localhost:${process.env.MOCK_PORT}`

export const userList = async () => {
  return await axios.post(`${baseUrl}/graphql`, data, {
    headers: {
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjgyNjc3Mjc5LCJleHAiOjE2ODI4NTAwNzl9.-EPA1aZbQmgqj015pJ73HJ3tVhQLcYxbYFCsxNRDdF0',
      "Content-Type": 'application/json'
    }
  })
}