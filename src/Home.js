import React, { useEffect, useContext, useState } from 'react';
import AppContext from './context/AppContext';
import getPlanetsApi from './Service/getPlanetsApi';
import { filterColumnsOptions, compFilter, nameIndices } from './myDataColections';
import {
  remKeyOfObject,
  arrayToString,
  selectModel,
  newMultipleFilter,
} from './Service/myHelpersFx';

function Home() {
  const { setDataContext, dataContext } = useContext(AppContext);
  const [colOptios, setColOptions] = useState(filterColumnsOptions);
  const localState = {
    filterWord: '',
    numFilterId: 0,
    filterColumn: 'population',
    filterOperador: 'maior que',
    valueFilter: 0,
    numberFilters: [],
    results: [],
  };

  const [homeState, setHomeState] = useState(localState);

  const {
    filterColumn,
    filterOperador,
    valueFilter,
    numberFilters,
    numFilterId,
  } = homeState;

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

  const handlerChangeBasic = ({ target: { value, name } }) => {
    setHomeState({ ...homeState, [name]: value });
  };

  const filterWordFx = (name, value) => {
    setHomeState({
      ...homeState,
      [name]: value,
      results: dataContext.results
        .filter((e) => e.name.includes(value)),
    });
  };

  const btnFiltrarFx = (name) => {
    if (valueFilter.lenght !== 0) {
      setColOptions(colOptios.filter((e) => e !== filterColumn));
      setHomeState({
        ...homeState,
        numFilterId: numFilterId + 1,
        filterColumn: colOptios[0] ?? '',
        numberFilters: [...numberFilters,
          { col: filterColumn, op: filterOperador, val: valueFilter, id: numFilterId }],
        results: newMultipleFilter(dataContext.results, [...numberFilters, {
          col: filterColumn, op: filterOperador, val: valueFilter, id: numFilterId,
        }]),
        [name]: '',
      });
    }
  };

  const handlerFilter = ({ target: { name, value } }) => {
    switch (name) {
    case 'filterWord':
      filterWordFx(name, value);
      break;

    case 'btnFiltrar':
      btnFiltrarFx(name);
      break;

    case 'btnRemoveFilter':
      setColOptions([...colOptios, ...numberFilters
        .filter((e) => Number(e.id) === Number(value))
        .map((i) => (i.col))]);

      setHomeState({
        ...homeState,
        numberFilters: numberFilters.filter((e) => e.id !== Number(value)),
        filterColumn: colOptios[0] ?? '',
        results: newMultipleFilter(dataContext.results, numberFilters
          .filter((e) => e.id !== Number(value))),
      });
      break;
    case 'btnRemoveFilters':
      setColOptions(filterColumnsOptions);
      setHomeState({
        numberFilters: [],
        filterColumn: 'population',
        results: dataContext.results,
      });
      break;
    default:
      console.log(name);
    }
    console.log(name);
  };

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
      <div>

        {selectModel({
          arrayOptions: colOptios,
          dataTest: 'column-filter',
          label: 'Column',
          name: 'filterColumn',
          value: homeState.filterColumn,
          onChange: handlerChangeBasic,
        })}

        {selectModel({
          arrayOptions: compFilter,
          dataTest: 'comparison-filter',
          label: 'Operador',
          name: 'filterOperador',
          value: homeState.filterOperador,
          onChange: handlerChangeBasic,
        })}
        <input
          data-testid="value-filter"
          name="valueFilter"
          type="number"
          value={ homeState.valueFilter }
          onChange={ handlerChangeBasic }
        />
        <button
          type="button"
          name="btnFiltrar"
          data-testid="button-filter"
          onClick={ handlerFilter }
        >
          Filtrar
        </button>
        <button
          name="btnRemoveFilters"
          type="submit"
          data-testid="button-remove-filters"
          onClick={ handlerFilter }
        >
          Limpar filtros
        </button>
      </div>
      <div>
        { numberFilters.map((e) => (
          <div key={ Math.random() }>
            <p data-testid="filter">
              { `${e.col} ${e.op} ${e.val}` }
              <button
                name="btnRemoveFilter"
                type="submit"
                value={ e.id }
                onClick={ handlerFilter }
              >
                remove filter
              </button>
            </p>
          </div>
        ))}
      </div>
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
