const express = require('express');
const { signup, signin, signout, forgotPassword, resetPassword, socialLogin } = require('../controllers/auth');

// nhập trình xác nhận lại mật khẩu
const { userSignupValidator, userSigninValidator, passwordResetValidator } = require('../validator');
const { userById } = require('../controllers/user');

const router = express.Router();

router.post('/signup', userSignupValidator, signup);
router.post('/signin', userSigninValidator, signin);
router.get('/signout', signout);

// quên mật khẩu và thiết lập lại tuyến đường
router.put('/forgot-password', forgotPassword);
router.put('/reset-password', passwordResetValidator, resetPassword);

//sau đó sử dụng tuyến đường này để đăng nhập xã hội
router.post('/social-login', socialLogin);

//bất kỳ tuyến đường nào có chứa: userId, ứng dụng của chúng tôi trước tiên sẽ thực thi userByID ()
router.param('userId', userById);

module.exports = router;
