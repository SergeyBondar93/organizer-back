const User = require("../model/user");

const { starterLists } = require("../consts");

async function regUser(user) {
  const candidate = await User.findOne({ email: user.email });
  if (candidate) {
    console.log("user with this email has been registered");
    return;
  }

  const $user = new User(user);
  const newUser = await $user.save();
  await createList({
    userId: newUser._id,
    name: "Today todos",
    data: starterLists,
  });
  console.log("User registered");
  return newUser;
}
regUser({
  nickname: "sergey",
  email: "abobopw@gmail.com",
  password: "123456789",
  name: "Sergey Bondar",
});
