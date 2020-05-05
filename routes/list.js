const { Router } = require("express");
const router = Router();
const List = require("../model/list");
const { removeFieldsFromObj } = require("../utils");
const { createList, updateList, deleteList } = require("../controller/list");

router.get("/", async (req, res) => {
  try {
    const userLists = await List.find({ creator: req.session.user._id });

    const lists = (userLists || []).map(({ data, ...rest }) => rest);

    res.json(lists);
  } catch (error) {
    res.status(401);
    res.json({ message: "Нет авторизации" });
    res.end();
  }
});

router.get("/:listId", async (req, res) => {
  try {
    const list = await List.findById(req.params.listId);

    const canSee = [list.creator._id, ...list.assignedUsers].some(
      (id) => id.toString() === req.session.user._id.toString()
    );

    if (!canSee) {
      res.status(401).json({ message: "Permission danied" }).end();
      return;
    }

    let $list = removeFieldsFromObj(list.toObject(), [
      "__v",
      "createDate",
      "creator",
    ]);

    res.json($list);
    res.end();
  } catch (error) {
    console.log(error);
    res.status(401);
    res.json({ error });
    res.end();
  }
});

router.post("/", async (req, res) => {
  try {
    const { name, data } = req.body;
    const userId = req.session.user._id;
    const list = await createList({ userId, name, data });
    res.json(list);
    res.end();
  } catch (error) {
    res.status(401);
    res.json({ error });
    res.end();
  }
});

router.post("/:listId", async (req, res) => {
  try {
    const id = req.params.listId;
    const list = await List.findById(id);
    const canSee = [list.creator, ...list.assignedUsers].some(
      (id) => id.toString() === req.session.user._id.toString()
    );
    if (!canSee) {
      res.status(401).json({ message: "Permission danied" }).end();
      return;
    }
    const { data, assignedUsers, name } = req.body;

    const $list = await updateList({ id, data, assignedUsers, name });
    res.json($list);
    res.end();
  } catch (error) {
    res.status(401);
    res.json({ error });
    res.end();
  }
});

router.delete("/:listId", async (req, res) => {
  try {
    const id = req.params.listId;
    const list = await List.findById(id);
    const canDelete =
      list.creator.toString() === req.session.user._id.toString();

    if (!canDelete) {
      res.status(401).json({ message: "Permission danied" }).end();
      return;
    }
    await deleteList({ id });
    res.json({ message: "success delete" });
    res.end();
  } catch (error) {
    res.status(401);
    res.send("Ошибка удаления");
    res.end();
  }
});

module.exports = router;
