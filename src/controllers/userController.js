// Mock in-memory store (replace with database in production)
let users = [];
let userId = 1;

exports.createUser = (req, res) => {
  const { name, email, age } = req.body;

  const user = {
    id: userId++,
    name,
    email,
    age: age || null,
    createdAt: new Date().toISOString(),
  };

  users.push(user);

  res.status(201).json({
    success: true,
    data: user,
  });
};

exports.getUsers = (req, res) => {
  res.json({
    success: true,
    data: users,
  });
};

exports.resetUsers = () => {
  users = [];
  userId = 1;
};
