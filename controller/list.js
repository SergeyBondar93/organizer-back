const List = require("../model/list");
const { changedList } = require("../consts");

async function createList({ userId, name, data }) {
  const list = new List({
    creator: userId,
    name,
    data,
  });
  await list.save();
  console.log("лист созданы");
  return list;
}

async function updateList({ id, data, assignedUsers, name }) {
  const newListFields = {};
  if (data) newListFields.data = data;
  if (assignedUsers) newListFields.assignedUsers = assignedUsers;
  if (name) newListFields.name = name;

  const list = await List.findByIdAndUpdate(id, {
    lastModified: Date.now(),
    ...newListFields,
  });
  return list;
}
updateList({
  id: "5ea5663c219f643a04104437",
  data: changedList,
  name: "Updates list1",
});

async function deleteList({ id }) {
  await List.findByIdAndDelete(id);
  return true;
}

module.exports = {
  createList,
  updateList,
  deleteList,
};
