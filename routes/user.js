const express = require("express");
const {
    userById,
    allUsers,
    getUser,
    updateUser,
    deleteUser,
    userPhoto,
    addFollowing,
    addFollower,
    removeFollowing,
    removeFollower,
    findPeople,
    hasAuthorization
} = require("../controllers/user");
const { requireSignin } = require("../controllers/auth");

const router = express.Router();

router.put("/user/follow", requireSignin, addFollowing, addFollower);
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

router.get("/users", allUsers);
router.get("/user/:userId", requireSignin, getUser);
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);
// photo
router.get("/user/photo/:userId", userPhoto);

//người làm theo DÕI
router.get("/user/findpeople/:userId", requireSignin, findPeople);

// bất kỳ tuyến đường nào có chứa: userId, ứng dụng của chúng tôi trước tiên sẽ thực thi userByID ()
router.param("userId", userById);

module.exports = router;
