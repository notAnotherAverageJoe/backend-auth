const db = require("../config/db");
const bcrypt = require("bcryptjs");

async function searchForUsers() {
  const userQuery = "SELECT * FROM users";
  const result = await db.query(userQuery);
  return result.rows;
}

async function getUserByEmail(email) {
  const emailQuery = "SELECT * FROM users WHERE email = $1";
  const results = await db.query(emailQuery, [email]);
  return results.rows[0];
}

async function createUser(username, email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserQuery =
      "INSERT INTO users (username, email, password) VALUES($1,$2,$3) RETURNING id, username, email";
    const result = await db.query(newUserQuery, [
      username,
      email,
      hashedPassword,
    ]);
    return result.rows[0];
  } catch (error) {
    console.error("Failed to create new user", error);
  }
}

async function userChanges(id, usersData) {
  try {
    const { username, email, password } = usersData;
    const query =
      "UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *";
    const result = await db.query(query, [username, email, password, id]);
    return result.rows[0];
  } catch (error) {
    console.error("Failed to update user", error);
  }
}

async function deleteUserById(id) {
  try {
    const query = "DELETE FROM users WHERE id = $1";
    const result = await db.query(query, [id]);
    return result;
  } catch (error) {
    console.error("Failed to delete user", error);
  }
}

module.exports = {
  searchForUsers,
  getUserByEmail,
  createUser,
  userChanges,
  deleteUserById,
};
