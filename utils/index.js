const removeFieldsFromObj = (obj, fields) => {
  const $obj = { ...obj };
  fields.forEach((field) => {
    delete $obj[field];
  });
  return $obj;
};

const defaultRemovedUserFields = ["password", "regDate", "logins", "__v"];
const mapUserBeforeSend = (user, removed = []) =>
  removeFieldsFromObj(user, [...defaultRemovedUserFields, ...removed]);

module.exports = {
  removeFieldsFromObj,
  defaultRemovedUserFields,
  mapUserBeforeSend,
};
