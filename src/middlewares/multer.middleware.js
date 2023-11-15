const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = ''

        if (file.mimetype.startsWith('image/')) {
            if(file.originalname.startsWith('profileImage')){
                uploadPath = path.join(__dirname, '..', 'public', 'img', 'profiles')
            } else {
                uploadPath = path.join(__dirname, '..', 'public', 'img', 'products')
            }
        } else {
            uploadPath = path.join(__dirname, '..', 'public', 'documents')
        }

        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})


const uploader = multer({ storage: storage})

module.exports = uploader

