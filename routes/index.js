import express from "express";
import multer from 'multer'
import {commentController, postController, userController, likeController, followController} from "../controllers/index.js";
import authenticateToken from '../middlware/auth.js'

const router = express.Router()

const storage = multer.diskStorage({
  destination: 'uploads',
  fileName: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const upload = multer({ storage })

// роуты пользователя
router.post('/register', userController.register)
router.post('/login', userController.login)
router.get('/current', authenticateToken, userController.current)
router.get('/users/:id', authenticateToken, userController.getUserById)
router.put('/users/:id', authenticateToken, upload.single('avatar'), userController.updateUser)

// роуты постов
router.post('/posts', authenticateToken, postController.createPost)
router.get('/posts', authenticateToken, postController.getAllPosts)
router.get('/posts/:id', authenticateToken, postController.getPostById)
router.delete('/posts/:id', authenticateToken, postController.deletePost)

// роуты комментариев
router.post('/comments', authenticateToken, commentController.createComment)
router.delete('/comments/:id', authenticateToken, commentController.deleteComment)

// роуты лайков
router.post('/likes', authenticateToken, likeController.likePost)
router.delete('/likes/:id', authenticateToken, likeController.unlikePost)

// роуты фолловов
router.post('/follow', authenticateToken, followController.followUser)
router.delete('/unfollow/:id', authenticateToken, followController.unfollowUser)

export default router