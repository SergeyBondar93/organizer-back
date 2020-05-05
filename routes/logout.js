const { Router } = require("express");
const router = Router();

router.get("/", async (req, res) => {
  try {
    req.session.user = null;
    req.session.isAuth = false;
    req.session.destroy((err) => {
      if (err) {
        res.status(401).json({ message: "Ошибка destroy сессии" }).end();
        return;
      }
      res.json({
        message: "logout success",
      });
      res.end();
    });
  } catch (error) {
    console.log(error);
    res.status(400);
    res.send("Не верный логин/пароль");
    res.end();
  }
});

module.exports = router;
