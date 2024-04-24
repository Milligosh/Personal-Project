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
  fetchUserByEmail: `SELECT id,firstname,lastname,username,email,password,phonenumber,created_at,role FROM users WHERE email=$1`,
  fetchUserByUsername:`SELECT firstname,lastname,username,email,password,phonenumber,role FROM users WHERE username=$1`
};
