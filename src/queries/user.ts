export const userQueries = {
  createNewUser: `
INSERT INTO users(
    firstname,
    lastname,
    username,
    email,
    password,
    phonenumber,
    role 
)VALUES($1,$2,$3,$4,$5,$6,$7)RETURNING id,firstname,username,email,phonenumber,role,created_at;
`,
  fetchUserByEmail: `SELECT id,firstname,lastname,username,email,phonenumber,created_at,role FROM users WHERE email=$1`,
  fetchUserByUsername: `SELECT firstname,lastname,username,email,password,phonenumber,role FROM users WHERE username=$1`,

  fetchAllUsers: `SELECT id,firstname,lastname,username,email,phonenumber,role,created_at FROM users`,

  fetchUserbyId: `Select id,firstname,lastname,username,email,phonenumber,role FROM users where id=$1`,

  updateUser: `UPDATE users SET firstname=$1,lastname=$2,username=$3,email=$4,phonenumber=$5 where id=$6`,
  deleteUser: ` DELETE FROM users where id=$1`,
};
