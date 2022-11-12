function remKeyOfObject(object, removeKeys) {
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

const selectModel = ({ name, id, dataTest, arrayOptions, label, value, onChange }) => (
  <label htmlFor={ id }>
    {label}
    <select
      name={ name }
      value={ value }
      id={ id }
      data-testid={ dataTest }
      onChange={ onChange }
    >
      {arrayOptions.map((e) => (<option key={ e } value={ e }>{e}</option>))}
    </select>
  </label>
);

/* const modelInputText = ({ nome, id, label, dataTest, value, onChange }) => (
  <label htmlFor={ id }>
    {label}
    <input
      name={ nome }
      value={ value }
      id={ id }
      data-testid={ dataTest }
      type="text"
      onChange={ onChange }
    />
  </label>) */

const radioButonModel = ({ id, dataTest, type, name, value, label, onChange }) => (
  <label htmlFor={ id }>
    <input
      id={ id }
      data-testid={ dataTest }
      type={ type }
      name={ name }
      value={ value }
      onChange={ onChange }
    />
    {label}
  </label>);

function newMultipleFilter(allData, allFilters) {
  let arr = [...allData];
  allFilters.forEach((i) => {
    const { col, op, val } = i;
    switch (op) {
    case 'maior que':
      arr = arr.filter((e) => (Number(e[col]) > Number(val)));
      break;
    case 'menor que':
      arr = arr.filter((e) => (Number(e[col]) < Number(val)));
      break;
    default:
      arr = arr.filter((e) => (Number(e[col]) === Number(val)));
      break;
    }
  });
  return arr;
}

const mySortObjects = (data, col, order) => {
  const arr = [...data.filter((e) => (e[col] !== 'unknown'))];
  const unknows = [...data.filter((e) => (e[col] === 'unknown'))];
  switch (order) {
  case 'ASC':
    return [...arr.sort((a, b) => (a[col] - b[col])), ...unknows];
  default:
    return [...arr.sort((a, b) => (b[col] - a[col])), ...unknows];
  }
};

/* const profile = {
  firstName: 'Lucas',
  lastName: 'Oliveira',
  country: 'Brasil',
  city: 'Itapevi',
  favoriteColor: 'Azul',
};
const list = ['city', 'name'];
console.log(remKeyOfObject(profile, list)); */

export {
  remKeyOfObject,
  arrayToString,
  /* modelInputText */
  selectModel,
  newMultipleFilter,
  radioButonModel,
  mySortObjects,
};
