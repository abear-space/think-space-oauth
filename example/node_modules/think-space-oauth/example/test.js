function getKeyName(kv) {
  for (let i in kv) {
    return i;
  }
  return false;
}

let a = "123";
let b = { a };
console.log(getKeyName(b));
