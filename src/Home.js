import React, { useEffect, useContext } from 'react';
import { remKeyOfObject, arrayToString } from './Service/myHelpersFx';
import AppContext from './context/AppContext';
import getPlanetsApi from './Service/getPlanetsApi';

function Home() {
  /* const [localData, setLocalData] = useState(''); */
  const { setDataContext, dataContext } = useContext(AppContext);

  useEffect(() => {
    if (!dataContext.results) {
      const fetchPlanets = async () => {
        const data = await getPlanetsApi();
        const keysResult = data.results
          .map((e) => remKeyOfObject(e, ['residents']));
        const newContext = { ...dataContext, results: keysResult };
        setDataContext(newContext);
        console.log(dataContext);
      };
      fetchPlanets();
    }
  });
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
      <table border="1">
        <tr>{nameIndices.map((e) => <th key={ e }>{e}</th>)}</tr>
        {console.log(dataContext.results)}
        {dataContext.results
          ? dataContext.results
            .map((e) => (
              <tr key={ Math.random() }>
                {Object.keys(e).map((i) => (
                  <th key={ Math.random() }>
                    {Array.isArray(e[i]) ? arrayToString(e[i]) : e[i]}
                  </th>))}
              </tr>))
          : <h2>Loading...</h2> }
      </table>
    </>
  );
}

export default Home;
