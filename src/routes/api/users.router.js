const { Router } = require('express')
const { changeUserRole, uploadFiles, getUsers, deleteUsers } = require('../../controllers/user.controller')
const uploader = require('../../middlewares/multer.middleware')

const router = Router()

router.get('/', getUsers)

router.delete('/', deleteUsers)

router.put('/premium/:uid', changeUserRole)

router.post('/:uid/documents', uploader.array('file'), uploadFiles)

module.exports = router