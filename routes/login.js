const { Router } = require("express");
const router = Router();
const User = require("../model/user");
const List = require("../model/list");
const { mapUserBeforeSend } = require("../utils");
const bcrypt = require("bcryptjs");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: "Не верный логин/пароль" }).end();
      return;
    }
    const success = await bcrypt.compare(password, user.password);
    if (!success) {
      res.status(401).json({ message: "Не верный логин/пароль" }).end();
      return;
    }

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
    res.status(400);
    res.send("Не верный логин/пароль");
    res.end();
  }
});

router.get("/", async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      res.status(401).json({ message: "Вы не авторизованы" }).end();
      return;
    }

    const lists = await List.find({ creator: user._id })
      .populate("creator")
      .exec();

    let $lists = lists.map(
      ({ _doc: { data, creator, __v, createDate, ...rest } }) => ({
        ...rest,
      })
    );
    res.json({
      user: mapUserBeforeSend(user),
      lists: $lists,
    });
    res.end();
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send("Не верный логин/пароль");
    res.end();
  }
});

module.exports = router;
