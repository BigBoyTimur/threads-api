import prisma from "../prisma/prisma-client.js";

const likeController = {
  likePost: async (req, res) => {
    const { postId } = req.body
    const userId = req.user.userId

    if (!postId)
      return res.status(400).json({ error: 'Все поля обязательны' })

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId }
      })

      if (existingLike) {
        return res.status(400).json({ error: 'Вы уже поставили лайк' })
      }

      const like = await prisma.like.create({
        data: { postId, userId }
      })
      res.json(like)
    } catch (error) {
      console.error('Error like post', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  unlikePost: async (req, res) => {
    const { id: postId } = req.params
    const userId = req.user.userId

    if (!postId)
      return res.status(400).json({ error: 'Все поля обязательны' })

    try {
      const existingLike = await prisma.like.findFirst({
        where: { postId, userId }
      })

      if (!existingLike) {
        return res.status(400).json({ error: 'Такого лайка не существует' })
      }

      const like = await prisma.like.deleteMany({
        where: { postId, userId }
      })

      res.json(like)
    } catch (error) {
      console.error('Error unlike post', error)
      if (error.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({ error: 'некорректный запрос' })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export { likeController }