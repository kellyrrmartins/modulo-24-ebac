import 'dotenv/config'

import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { userList } from '../request/user.request';

const mockProvider = new Pact({
  consumer: 'ebac-demo-store-admin',
  provider: 'ebac-demo-store-server',
  port: process.env.MOCK_PORT,
  log: resolve(process.cwd(), 'logs', 'pact.log'),
  dir: resolve(process.cwd(), 'pacts')
})

describe('Teste de consumidor', () => {
  beforeAll(async () => {
    await mockProvider.setup().then(() => {
      mockProvider.addInteraction({
        uponReceiving: 'a request',
        withRequest: {
          method: 'POST',
          path: '/graphql',
          headers: {
            Authorization: 'Bearer  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjgxMTIzMTkyLCJleHAiOjE2ODEyOTU5OTJ9.2BDsOoLqFVCQTt4hB1y6az8fB4trn1xMqQ51LfEY3nA',
            "Content-Type": 'Application/json'
          },
          body: { "operationName": "users", "variables": { "where": {}, "take": 50, "skip": 0, "orderBy": { "id": "Asc" } }, "query": "query users($where: UserWhereInput, $orderBy: UserOrderByInput, $skip: Float, $take: Float) {\n  items: users(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    createdAt\n    firstName\n    id\n    lastName\n    roles\n    updatedAt\n    username\n    __typename\n  }\n  total: _usersMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}" }
        },
        willRespondWith: {
          status: 200,
          headers: {
            "Content-Type": 'application/json; charset=utf-8'
          },
          body: {
            "data": {
              "items": eachLike(
                {
                  "createdAt": somethingLike("2023-03-29T10:31:16.894Z"),
                  "firstName": somethingLike("Kelly"),
                  "id": somethingLike("clftjr3bz0000sncqd2pmruz1"),
                  "lastName": somethingLike("Martins"),
                  "roles": ["user"],
                  "updatedAt": somethingLike("2023-04-06T12:11:02.664Z"),
                  "username": somethingLike("admin"),
                  "__typename": somethingLike("User")
                },
                { min: 3 }
              ),
              "total": {
                "count": "3", "__typename": "MetaQueryPayload"
              }
            }
          }
        }
      })
    })
  })

  afterAll(() => mockProvider.finalize())
  // afterEach(() => mockProvider.verify())
  it('Deve retornar lista de usuario', () => {
    userList().then(response => {
      const { firstName, lastName } = response.data.data.items[1]

      expect(response.status).toEqual(200)
      expect(firstName).toBe('Kelly')
      expect(lastName).toBe('Martins')
    })
  });
});