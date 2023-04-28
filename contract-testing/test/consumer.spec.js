import 'dotenv/config'
import { Pact } from "@pact-foundation/pact"
import { resolve } from 'path'
import { eachLike, somethingLike } from '@pact-foundation/pact/src/dsl/matchers';
import { userList } from '../request/user.request';

const mockProvider = new Pact({
  consumer: 'ebac-demo-store-admin',
  provider: 'ebac-demo-store-server',
  port: parseInt(process.env.MOCK_PORT),
  log: resolve(process.cwd(), 'logs', 'pact.log'),
  dir: resolve(process.cwd(), 'pacts')
})

describe('Consumer Test', () => {

  beforeAll(async () => {
    await mockProvider.setup().then(() => {
      mockProvider.addInteraction({
        uponReceiving: 'a request',
        withRequest: {
          method: 'POST',
          path: '/graphql',
          headers: {
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjgyNjc3Mjc5LCJleHAiOjE2ODI4NTAwNzl9.-EPA1aZbQmgqj015pJ73HJ3tVhQLcYxbYFCsxNRDdF0',
            "Content-Type": 'application/json'
          },
          body: {
            "operationName": "users",
            "variables": { "where": {}, "take": 50, "skip": 0, "orderBy": { "id": "Asc" } }, "query": "query users($where: UserWhereInput, $orderBy: UserOrderByInput, $skip: Float, $take: Float) {\n  items: users(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    createdAt\n    firstName\n    id\n    lastName\n    roles\n    updatedAt\n    username\n    __typename\n  }\n  total: _usersMeta(where: $where, orderBy: $orderBy, skip: $skip, take: $take) {\n    count\n    __typename\n  }\n}"
          }
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
                  "createdAt": somethingLike("2023-03-29T10:41:26.856Z"),
                  "firstName": somethingLike("Kelly"),
                  "id": somethingLike("clftk45zc0022mqcq6okdkfcy"),
                  "lastName": somethingLike("Martins"),
                  "roles": ["user"],
                  "updatedAt": somethingLike("2023-03-29T10:41:26.857Z"),
                  "username": somethingLike("kellyMartins"),
                  "__typename": somethingLike("User")
                },
                { min: 2 }
              ),
              "total": {
                "count": "2",
                "__typename": "MetaQueryPayload"
              }
            }
          }

        }
      })
    })
  })


  it('should return user list', () => {
    userList().then(response => {
      const { firstName, lastName } = response.data.data.items[0]

      expect(response.status).toEqual(200)
      expect(firstName).toBe('Kelly')
      expect(lastName).toBe('Martins')
    })
      .then(() => {
        mockProvider.finalize()
        mockProvider.verify()
      })
  });
});