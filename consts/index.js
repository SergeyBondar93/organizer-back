const starterLists = [
  {
    listName: "To do",
    listItems: [
      {
        name: "to activate email",
        description: "to activate email for registration",
      },
      {
        name: "Profile",
        description: "fill in your profile",
      },
    ],
  },
  {
    listName: "In propgress",
    listItems: [
      {
        name: "Account",
        description: "Signing up for an account",
      },
    ],
  },
  {
    listName: "Done",
    listItems: [
      {
        name: "Find a service",
        description: "Find the best service for your to-do list",
      },
    ],
  },
];

const changedList = [
  {
    listName: "To do",
    listItems: [],
  },
  {
    listName: "In propgress",
    listItems: [],
  },
  {
    listName: "Done",
    listItems: [
      {
        name: "Find a service",
        description: "Find the best service for your to-do list",
      },
      {
        name: "Account",
        description: "Signing up for an account",
      },
    ],
  },
];

module.exports = { starterLists, changedList };
