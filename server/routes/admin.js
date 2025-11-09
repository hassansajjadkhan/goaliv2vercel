const express = require('express')
const multer = require('multer')
const upload = multer({dest: 'uploads/'})
const {
    getAdminMetrics,
    getTeamUsers,
    getTeamInvites,
    getActivityLogs,
    getTeamPayments,
    removeUserFromTeam,
    updateCoverImage
} = require('../controllers/adminController')

const router = express.Router()

router.get('/metrics', getAdminMetrics);
router.get('/users', getTeamUsers);
router.get('/invites', getTeamInvites);
router.get('/activity', getActivityLogs);
router.get('/payments', getTeamPayments);
router.post('/remove-user', removeUserFromTeam)
router.post('/cover-image', upload.single('cover'), updateCoverImage)



module.exports = router