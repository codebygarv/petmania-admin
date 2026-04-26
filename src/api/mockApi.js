const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockUsers = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    phoneNumber: "+91 98765 43210",
    isVerified: true,
    isAdharVerified: true,
    userVerified: true,
    createdAt: "2025-01-10T10:00:00Z",
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    phoneNumber: "+91 91234 56789",
    isVerified: false,
    isAdharVerified: false,
    userVerified: false,
    createdAt: "2025-01-12T14:30:00Z",
  },
  {
    id: "3",
    name: "Carlos Ruiz",
    email: "carlos@example.com",
    phoneNumber: "+91 99876 54321",
    isVerified: true,
    isAdharVerified: false,
    userVerified: false,
    createdAt: "2025-02-05T09:15:00Z",
  },
  {
    id: "4",
    name: "Aisha Khan",
    email: "aisha@example.com",
    phoneNumber: "+91 90123 45678",
    isVerified: true,
    isAdharVerified: true,
    userVerified: false,
    createdAt: "2025-02-14T16:45:00Z",
  },
  {
    id: "5",
    name: "Liam O'Neil",
    email: "liam@example.com",
    phoneNumber: "+91 99988 77666",
    isVerified: false,
    isAdharVerified: false,
    userVerified: false,
    createdAt: "2025-03-01T11:20:00Z",
  },
];

const mockPets = [
  {
    id: "1",
    name: "Max",
    type: "Dog",
    breed: "Golden Retriever",
    age: 3,
    gender: "Male",
    city: "Mumbai",
    isAdopted: false,
    isApproved: true,
    images: ["https://placehold.co/400x300?text=Dog+1"],
    userId: { name: "John Doe", email: "john@example.com" },
    createdAt: "2025-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Bella",
    type: "Cat",
    breed: "Persian",
    age: 2,
    gender: "Female",
    city: "Delhi",
    isAdopted: false,
    isApproved: false,
    images: ["https://placehold.co/400x300?text=Cat+1"],
    userId: { name: "Priya Sharma", email: "priya@example.com" },
    createdAt: "2025-01-18T14:30:00Z",
  },
  {
    id: "3",
    name: "Charlie",
    type: "Dog",
    breed: "Labrador",
    age: 1,
    gender: "Male",
    city: "Bangalore",
    isAdopted: false,
    isApproved: true,
    images: ["https://placehold.co/400x300?text=Dog+2"],
    userId: { name: "Carlos Ruiz", email: "carlos@example.com" },
    createdAt: "2025-02-01T09:15:00Z",
  },
  {
    id: "4",
    name: "Lucy",
    type: "Cat",
    breed: "Siamese",
    age: 4,
    gender: "Female",
    city: "Mumbai",
    isAdopted: false,
    isApproved: true,
    images: ["https://placehold.co/400x300?text=Cat+2"],
    userId: { name: "Aisha Khan", email: "aisha@example.com" },
    createdAt: "2025-02-10T16:45:00Z",
  },
  {
    id: "5",
    name: "Cooper",
    type: "Dog",
    breed: "German Shepherd",
    age: 2,
    gender: "Male",
    city: "Pune",
    isAdopted: false,
    isApproved: false,
    images: ["https://placehold.co/400x300?text=Dog+3"],
    userId: { name: "Liam O'Neil", email: "liam@example.com" },
    createdAt: "2025-03-05T11:20:00Z",
  },
];

export const mockApi = {
  getUsers: async (params = {}) => {
    await delay(800);
    let filtered = [...mockUsers];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      );
    }

    if (params.isVerified !== undefined) {
      filtered = filtered.filter((u) => u.isVerified === (params.isVerified === "true"));
    }

    if (params.isAdharVerified !== undefined) {
      filtered = filtered.filter((u) => u.isAdharVerified === (params.isAdharVerified === "true"));
    }

    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 5;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      success: true,
      data: {
        users: paginated,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  },

  verifyUser: async (id, data) => {
    await delay(600);
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
      return { success: true, message: "User verified successfully" };
    }
    return { success: false, error: "User not found" };
  },

  deleteUser: async (id) => {
    await delay(600);
    const userIndex = mockUsers.findIndex((u) => u.id === id);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
      return { success: true, message: "User deleted successfully" };
    }
    return { success: false, error: "User not found" };
  },

  getPets: async (params = {}) => {
    await delay(800);
    let filtered = [...mockPets];

    if (params.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.type.toLowerCase().includes(q) ||
          p.breed.toLowerCase().includes(q)
      );
    }

    if (params.isApproved !== undefined) {
      filtered = filtered.filter((p) => p.isApproved === (params.isApproved === "true"));
    }

    if (params.city) {
      filtered = filtered.filter((p) =>
        p.city.toLowerCase().includes(params.city.toLowerCase())
      );
    }

    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 5;
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = filtered.slice(start, end);

    return {
      success: true,
      data: {
        pets: paginated,
        total: filtered.length,
        page,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  },

  approvePet: async (id) => {
    await delay(600);
    const petIndex = mockPets.findIndex((p) => p.id === id);
    if (petIndex !== -1) {
      mockPets[petIndex].isApproved = true;
      return { success: true, message: "Pet approved successfully" };
    }
    return { success: false, error: "Pet not found" };
  },

  rejectPet: async (id, reason) => {
    await delay(600);
    const petIndex = mockPets.findIndex((p) => p.id === id);
    if (petIndex !== -1) {
      mockPets[petIndex].isApproved = false;
      return { success: true, message: `Pet rejected: ${reason}` };
    }
    return { success: false, error: "Pet not found" };
  },

  deletePet: async (id) => {
    await delay(600);
    const petIndex = mockPets.findIndex((p) => p.id === id);
    if (petIndex !== -1) {
      mockPets.splice(petIndex, 1);
      return { success: true, message: "Pet deleted successfully" };
    }
    return { success: false, error: "Pet not found" };
  },

  getDashboardStats: async () => {
    await delay(600);
    return {
      success: true,
      data: {
        totalUsers: mockUsers.length,
        verifiedUsers: mockUsers.filter((u) => u.isVerified).length,
        adharVerifiedUsers: mockUsers.filter((u) => u.isAdharVerified).length,
        totalPets: mockPets.length,
        approvedPets: mockPets.filter((p) => p.isApproved).length,
        pendingPets: mockPets.filter((p) => !p.isApproved).length,
        adoptedPets: mockPets.filter((p) => p.isAdopted).length,
      },
    };
  },
};