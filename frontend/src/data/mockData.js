export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@gamification.local",
    role: "ADMIN",
    currentPoints: 0,
    totalEarnedPoints: 0,
    badgeCount: 0,
    documentUploadCount: 0,
    purchaseCount: 0,
    friendCount: 0,
    avatarUrl: "https://i.pravatar.cc/160?u=rewardhub-admin",
  },
  {
    id: 2,
    username: "professor_ana",
    email: "ana@university.local",
    role: "USER",
    currentPoints: 50,
    totalEarnedPoints: 50,
    badgeCount: 1,
    documentUploadCount: 1,
    purchaseCount: 0,
    friendCount: 1,
    avatarUrl: "https://i.pravatar.cc/160?u=rewardhub-professor-ana",
  },
  {
    id: 3,
    username: "student_marko",
    email: "marko@student.local",
    role: "USER",
    currentPoints: 40,
    totalEarnedPoints: 40,
    badgeCount: 1,
    documentUploadCount: 1,
    purchaseCount: 0,
    friendCount: 1,
    avatarUrl: "https://i.pravatar.cc/160?u=rewardhub-student-marko",
  },
  {
    id: 4,
    username: "student_elena",
    email: "elena@student.local",
    role: "USER",
    currentPoints: 15,
    totalEarnedPoints: 15,
    badgeCount: 0,
    documentUploadCount: 1,
    purchaseCount: 0,
    friendCount: 1,
    avatarUrl: "https://i.pravatar.cc/160?u=rewardhub-student-elena",
  },
];

export const mockBadges = [
  {
    id: 1,
    name: "First Upload",
    description: "Awarded after earning 25 total points.",
    pointsRequired: 25,
    iconUrl: "/badge-first-upload.png",
  },
  {
    id: 2,
    name: "Research Rookie",
    description: "Awarded after earning 100 total points.",
    pointsRequired: 100,
    iconUrl: "/badge-research-rookie.png",
  },
  {
    id: 3,
    name: "Knowledge Builder",
    description: "Awarded after earning 250 total points.",
    pointsRequired: 250,
    iconUrl: "/badge-knowledge-builder.png",
  },
  {
    id: 4,
    name: "Campus Legend",
    description: "Awarded after earning 500 total points.",
    pointsRequired: 500,
    iconUrl: "/badge-campus-legend.png",
  },
];

export const mockUserBadges = {
  2: [{ id: 1, badge: mockBadges[0], earnedAt: "2026-05-15T10:20:00" }],
  3: [{ id: 2, badge: mockBadges[0], earnedAt: "2026-05-15T11:05:00" }],
  4: [],
};

export const mockUploads = [
  {
    id: 1,
    eventId: 1,
    userId: 2,
    username: "professor_ana",
    user: { id: 2, username: "professor_ana", email: "ana@university.local" },
    title: "Machine Learning in Education",
    documentType: "PAPER",
    fileSizeKb: 6200,
    scientificField: "Machine Learning",
    pointsAwarded: 50,
    createdAt: "2026-05-15T09:30:00",
  },
  {
    id: 2,
    eventId: 2,
    userId: 3,
    username: "student_marko",
    user: { id: 3, username: "student_marko", email: "marko@student.local" },
    title: "Open Data Survey",
    documentType: "ARTICLE",
    fileSizeKb: 1800,
    scientificField: "Data Science",
    pointsAwarded: 40,
    createdAt: "2026-05-15T10:45:00",
  },
  {
    id: 3,
    eventId: 3,
    userId: 4,
    username: "student_elena",
    user: { id: 4, username: "student_elena", email: "elena@student.local" },
    title: "Faculty Research Notes",
    documentType: "PDF",
    fileSizeKb: 900,
    scientificField: "Computer Science",
    pointsAwarded: 15,
    createdAt: "2026-05-15T12:10:00",
  },
];

export const mockFriends = {
  2: [mockUsers[2]],
  3: [mockUsers[3]],
  4: [mockUsers[2]],
};

export const mockShopItems = [
  {
    id: 1,
    name: "Digital Certificate",
    description: "Downloadable participation certificate for your research contributions.",
    pricePoints: 80,
    quantity: 100,
    itemType: "DIGITAL",
    expirationDays: null,
    active: true,
  },
  {
    id: 2,
    name: "Campus Coffee Voucher",
    description: "Physical voucher redeemable at the faculty cafe.",
    pricePoints: 50,
    quantity: 25,
    itemType: "PHYSICAL",
    expirationDays: 14,
    active: true,
  },
  {
    id: 3,
    name: "Priority Lab Seat",
    description: "Real-life benefit for one lab session reservation.",
    pricePoints: 150,
    quantity: 5,
    itemType: "REAL_LIFE_BENEFIT",
    expirationDays: 30,
    active: true,
  },
];

export const mockPurchases = {
  3: [
    {
      id: 1,
      userId: 3,
      username: "student_marko",
      shopItem: mockShopItems[1],
      pricePaid: 50,
      purchasedAt: "2026-05-08T14:20:00",
      expiresAt: "2026-05-22T14:20:00",
      status: "ACTIVE",
    },
  ],
};

export const mockPointHistory = {
  2: [
    { id: 1, amount: 50, type: "EARNED", reason: "Document upload: Machine Learning in Education", createdAt: "2026-05-15T09:30:00" },
  ],
  3: [
    { id: 2, amount: 40, type: "EARNED", reason: "Document upload: Open Data Survey", createdAt: "2026-05-15T10:45:00" },
  ],
  4: [
    { id: 3, amount: 15, type: "EARNED", reason: "Document upload: Faculty Research Notes", createdAt: "2026-05-15T12:10:00" },
  ],
};

export function getMockProfile(userId) {
  const user = mockUsers.find((item) => item.id === Number(userId)) || mockUsers[2];
  return {
    ...user,
    badges: mockUserBadges[user.id] || [],
  };
}

export function getAvatarUrl(userId, username) {
  const user = mockUsers.find((item) => item.id === Number(userId) || item.username === username);
  return user?.avatarUrl || `https://i.pravatar.cc/160?u=rewardhub-${username || userId}`;
}
