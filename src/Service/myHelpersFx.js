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

const modelInputText = ({ nome, id, label, dataTest, value, onChange }) => {
  const id2 = id ?? Math.random();
  return (
    <label htmlFor={ id2 }>
      {label}
      <input
        name={ nome }
        value={ value }
        id={ id2 }
        data-testid={ dataTest }
        type="text"
        onChange={ onChange }
      />
    </label>);
};

function newMultipleFilter({ allData, currData, column, operator, value }) {
  const arr = [...allData];

  switch (operator) {
  case 'maior que':
    return arr.filter((e) => (Number(e[column]) > Number(value)));
  case 'menor que':
    return arr.filter((e) => (Number(e[column]) < Number(value)));
  case 'igual a':
    return arr.filter((e) => (Number(e[column]) === Number(value)));
  default:
    return currData;
  }
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

export {
  remKeyOfObject,
  arrayToString,
  modelInputText,
  selectModel,
  newMultipleFilter,
};
