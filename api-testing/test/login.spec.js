const req = require('supertest')

describe('Login do usuario', () => {
  it('Deve pegar o token de acesso', () => {
    req('http://localhost:3000/api')
      .post('/login')
      .send({
        "username": "admin",
        "password": "admin"
      })
      .set('Accept', 'application/json')
      .then(response => {
        expect(response.statusCode).toEqual(201)
        expect(response.body.accessToken).not.toBe(undefined)
      })
  })
})
