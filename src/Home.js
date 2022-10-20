import React, { useEffect, useContext, useState } from 'react';
import { remKeyOfObject, arrayToString } from './Service/myHelpersFx';
import AppContext from './context/AppContext';
import getPlanetsApi from './Service/getPlanetsApi';

function Home() {
  /* const [localData, setLocalData] = useState(''); */
  const { setDataContext, dataContext } = useContext(AppContext);
  const localState = {
    results: [],
    filterWord: '',
  };
  const [homeState, setHomeState] = useState(localState);

  useEffect(() => {
    if (!dataContext.results) {
      const fetchPlanets = async () => {
        const data = await getPlanetsApi();
        const keysResult = data.results
          .map((e) => remKeyOfObject(e, ['residents']));
        const newContext = { ...dataContext, results: keysResult };
        setDataContext(newContext);
        setHomeState({ ...homeState, results: keysResult });
      };
      fetchPlanets();
    }
  });

  const handlerFilter = ({ target: { name, value } }) => {
    switch (name) {
    case 'filterWord':
      setHomeState({
        ...homeState,
        [name]: value,
        results: dataContext.results
          .filter((e) => e.name.includes(value)),
      });
      break;
    default:
      console.log(name);
    }
  };

  const nameIndices = [
    'Name',
    'Rotate Period',
    'Orbital Period',
    'Diameter',
    'Climate',
    'Gravity',
    'Terrain',
    'Surface Water',
    'Population',
    'Films',
    'Created',
    'Edited',
    'Url',
  ];

  return (
    <>
      <h1>
        Hello Home
      </h1>
      <div>
        Buscar
        <input
          data-testid="name-filter"
          name="filterWord"
          type="text"
          placeholder="Search"
          value={ homeState.filterWold }
          onChange={ handlerFilter }
        />
      </div>
      <div>Outros filtros</div>
      <table border="1">
        <tbody>
          <tr>{nameIndices.map((e) => <th key={ e }>{e}</th>)}</tr>
          {homeState.results
            ? homeState.results
              .map((e) => (
                <tr key={ Math.random() }>
                  {Object.keys(e).map((i) => (
                    <th key={ Math.random() }>
                      {Array.isArray(e[i]) ? arrayToString(e[i]) : e[i]}
                    </th>))}
                </tr>))
            : <h2>Loading...</h2> }
          {console.log(homeState)}
        </tbody>
      </table>
    </>
  );
}

export default Home;
