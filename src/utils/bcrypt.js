import bcrypt from "bcrypt";

const saltRounds = 10;
const myPlaintextPassword = "qwerty123";

const encryptPassword = (password) => {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
};

const comparePassword = (password, hash) => {
  const res = bcrypt.compareSync(password, hash);
  return res;
};

const hash = encryptPassword(myPlaintextPassword);
console.log(hash);
const res = comparePassword(myPlaintextPassword, hash);
console.log(res);

export { encryptPassword, comparePassword };