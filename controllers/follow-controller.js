import prisma from "../prisma/prisma-client.js";

const followController = {
  followUser: async (req, res) => {
    const { followingId } = req.body
    const userId = req.user.userId
    if (followingId === userId)
      return res.status(400).json({ error: 'Вы не можете подписаться на самого себя' })

    try {
      const existingFollow = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerId: userId },
            { followingId }
          ]
        }
      })

      if (existingFollow) {
        return res.status(400).json({ error: 'Подписка уже существует' })
      }

      const follow = await prisma.follows.create({
        data: {
          follower: { connect: { id: userId } },
          following: { connect: { id: followingId } }
        }
      })

      res.json(follow)
    } catch (error) {
      console.error('Follow error', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  },
  unfollowUser: async (req, res) => {
    const { id: followingId } = req.params
    const userId = req.user.userId

    try {
      const follow = await prisma.follows.findFirst({
        where: {
          AND: [
            { followerId: userId },
            { followingId }
          ]
        }
      })

      if (!follow) {
        return res.status(404).json({ error: 'Такой подписки не существует' })
      }

      const unfollow = await prisma.follows.delete({
        where: { id: follow.id }
      })

      res.json(unfollow)
    } catch (error) {
      console.error('Unfollow error', error)
      if (error.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({ error: 'некорректный запрос' })
      }
      res.status(500).json({ error: 'Internal server error' })
    }
  }
}

export { followController }