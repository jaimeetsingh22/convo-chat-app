export const sampleChats = [
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "john doe",
    _id: "1",
    groupChat: false,
    members: ["1", "2"],
  },
  {
    avatar: [
      "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
    ],
    name: "diago",
    _id: "2",
    groupChat: false,
    members: ["1", "2", "3", "4"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhony sins",
    _id: "3",
    groupChat: false,
    members: ["1", "2", "3", "4"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "4",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "5",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "6",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "7",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "8",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "9",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "10",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "jhonii",
    _id: "11",
    groupChat: false,
    members: ["1", "2", "4", "5"],
  },
];

export const sampleUsers = [
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "john doe",
    _id: "1",
  },
  {
    avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
    name: "diago",
    _id: "2",
  },
];
export const sampleNotifications = [
  {
    sender: {
      avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
      name: "john doe",
    },
    _id: "1",
  },
  {
    sender: {
      avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
      name: "diago",
    },
    _id: "2",
  },
];

export const sampleMessage = [
  {
    attachments: [
      {
        public_id: "adsfj",
        url: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      },
    ],
    content: "",
    _id: "laksjkjdf",
    sender: {
      _id: "asdfkj",
      name: "Binod",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
  {
    attachments: [],
    content: "Mast image hai",
    _id: "laksjkjdf2",
    sender: {
      _id: "asdfkj4",
      name: "Binod 2",
    },
    chat: "chatId",
    createdAt: "2024-02-12T10:41:30.630Z",
  },
];

export const dashBoardData = {
  users: [
    {
      name: "John Doe",
      avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      _id: "1",
      username: "john_doe",
      friends: "8",
      groups: "3",
    },
    {
      name: "Johny",
      avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      _id: "2",
      username: "johnyy",
      friends: "9",
      groups: "8",
    },
  ],
  chats: [
    {
      name: "John's Group",
      avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
      _id: "1",
      groupChat: false,
      members: [
        {
          _id: "1",
          avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
        },
        {
          _id: "2",
          avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
        },
      ],
      totalMembers: 5,
      totalMessage: 3,
      creator: {
        name: "John",
        avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      },
    },
    {
      name: "dabby's Group",
      avatar: ["https://cdn-icons-png.flaticon.com/128/2202/2202112.png"],
      _id: "2",
      groupChat: true,
      members: [
        {
          _id: "1",
          avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
        },
        {
          _id: "2",
          avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
        },
      ],
      totalMembers: 5,
      totalMessage: 3,
      creator: {
        name: "Dabby",
        avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      },
    },
  ],
  messages: [
    {
      attachments: [],
      sender: {
        name: "jonny",
        avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      },
      _id: "lskd",
      content: "Hi john",
      chat: "chatId",
      groupChat:true,
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      attachments: [{
        public_id:'jd',
        url:"https://cdn-icons-png.flaticon.com/128/2202/2202112.png"
      }],
      sender: {
        name: "john",
        avatar: "https://cdn-icons-png.flaticon.com/128/2202/2202112.png",
      },
      _id: "ksdjfoskc",
      content: "Hello",
      chat: "chatId",
      groupChat:false,
      createdAt: "2022-01-01T00:00:00.000Z",
    },
  ],
};
