import { Hono } from 'hono'
import { sign } from 'hono/jwt'
import { bearerAuth } from 'hono/bearer-auth'
import { Buffer } from 'node:buffer'

const app = new Hono()

const client_id = 'c92d7ad1e9174a0cb3e0975f2b1abbey3'
const client_secret = '9c69b04aa2d54767b9e4b7a34c58f9e2d4c76a8ed844b55d5d7e5c6aa2516af9'
const token = Buffer.from(`${client_id}:${client_secret}`).toString('base64')

app.post('/', bearerAuth({ token }), async (c) => {
  const body = await c.req.parseBody()
  if(body["grant_type"] !== 'client_credentials') {
    return c.json({
      'error': 'unsupported_grant_type',
      'error_description': 'The authorization grant type is not supported by the authorization server.'
    }, 400)
  }
  
  // jwtを生成する
  const payload = {
    sub: 'user123',
    iss: 'https://example.com',
    iat: Math.floor(Date.now() / 1000),
    aud: 'https://example.com',
    exp: Math.floor(Date.now() / 1000) + 60 * 5, // Token expires in 5 minutes
    client_id: 'c92d7ad1e9174a0cb3e0975f2b1abbey3',
  }
  const secret = 'mySecretKey'
  const token = await sign(payload, secret)


  return c.json({
    'access_token': token,
    'token_type': 'Bearer',
  })
})

export default app