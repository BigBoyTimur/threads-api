import jwt from 'jsonwebtoken'
import prisma from "../prisma/prisma-client.js";

export default (req, res, next) => {
  const authHeader = req.headers['authorization']

  const token = authHeader && authHeader.split(' ')[1]

  if (!token)
    return res.status(401).json({ error: 'unauthorized' })

  jwt.verify(token, process.env.SECRET_KEY, async (error, user) => {
    if (error) {
      return res.status(403).json({ error: 'Invalid token' })
    }

    const doesUserExists = await prisma.user.findUnique({
      where: { id: user.userId }
    })

    if (!doesUserExists) {
      return res.status(400).json({ error: 'Такого пользователя не существует' })
    }

    req.user = user

    next()
  })
}