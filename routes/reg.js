const { Router } = require("express");
const router = Router();
const User = require("../model/user");
const List = require("../model/list");
const { mapUserBeforeSend } = require("../utils");
const bcrypt = require("bcryptjs");
const { starterLists } = require("../consts");
const { createList } = require("../controller/list");

router.post("/", async (req, res) => {
  try {
    const { nickname, email, password, name } = req.body;
    const userObj = {};

    if (nickname) userObj.nickname = nickname;
    if (name) userObj.name = name;
    if (email) userObj.email = email;

    if (!password) {
      res.status(401).json({ message: "Пароль обязателен" }).end();
      return;
    }
    if (!email) {
      res.status(401).json({ message: "Email обязателен" }).end();
      return;
    }

    const candidate = await User.findOne({ email });

    if (candidate) {
      res
        .status(401)
        .json({ message: "Пользователь с таким email уже был зарегестрирован" })
        .end();
      return;
    }

    const hashPass = await bcrypt.hash(password, 10);
    const $user = new User({
      ...userObj,
      password: hashPass,
      logins: [Date.now()],
    });

    const user = await $user.save();

    await createList({
      userId: user._id,
      name: "Today todos",
      data: starterLists,
    });

    const lists = await List.find({ creator: user._id })
      .populate("creator")
      .exec();

    req.session.user = user;
    req.session.isAuth = true;
    req.session.save((err) => {
      if (err) {
        res.status(401).json({ message: "Ошибка создания сессии" }).end();
        return;
      }

      let $lists = lists.map(
        ({ _doc: { data, creator, __v, createDate, ...rest } }) => ({
          ...rest,
        })
      );

      res.json({
        user: mapUserBeforeSend(user.toObject()),
        lists: $lists,
      });
      user.update({
        logins: [...user.logins, Date.now()],
      });
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(500);
    res.send(error);
    res.end();
  }
});

module.exports = router;
