function remKeyOfObject(object, removeKeys) {
  if (!Array.isArray(removeKeys)) { throw new Error('2º parameter expect a type Array'); }
  if (typeof (object) !== 'object') {
    throw new Error('1º parameter expect a type Object');
  }

  const listKeys = Object.keys(object).filter((e) => !removeKeys.some((i) => i === e));
  let mapTemp = {};
  listKeys.forEach((e) => { mapTemp = { ...mapTemp, [e]: object[e] }; });
  return { ...mapTemp };
}

function arrayToString(array) {
  const arrayTemp = [];
  array.forEach((e) => {
    arrayTemp.push(`${e}
    `);
  });

  return arrayTemp;
}

/* const profile = {
  firstName: 'Lucas',
  lastName: 'Oliveira',
  country: 'Brasil',
  city: 'Itapevi',
  favoriteColor: 'Azul',
};

const list = ['city', 'name'];

console.log(remKeyOfObject(profile, list)); */

export { remKeyOfObject, arrayToString };
