import React, { useEffect, useContext, useState } from 'react';
import AppContext from './context/AppContext';
import getPlanetsApi from './Service/getPlanetsApi';
import { filterColumnsOptions, compFilter, nameIndices } from './myDataColections';
import { remKeyOfObject, arrayToString, selectModel, newMultipleFilter, radioButonModel,
  mySortObjects } from './Service/myHelpersFx';

function Home() {
  const localState = {
    filterWord: '',
    numFilterId: 0,
    filterColumn: 'population',
    filterOperador: 'maior que',
    valueFilter: 0,
    numberFilters: [],
    results: [],
    sortColum: '',
    sortDirection: '',
  };

  const sortInitialState = { order: { column: 'population', sort: 'ASC' } };
  const { setDataContext, dataContext } = useContext(AppContext);
  const [homeState, setHomeState] = useState(localState);
  const [colOptios, setColOptions] = useState(filterColumnsOptions);
  const [sortState, setSortState] = useState(sortInitialState);
  const { order: { column, sort } } = sortState;

  const {
    filterColumn, filterOperador, valueFilter, numberFilters, numFilterId,
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
  const btnSortMap = () => {
    setHomeState({
      ...localState,
      results: mySortObjects(homeState.results, column, sort),
    });
  };
  const handlerSort = ({ target: { value, name } }) => {
    setSortState({ order: { ...sortState.order, [name]: value } });
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
    setColOptions(colOptios.filter((e) => e !== filterColumn));
    setHomeState({
      ...homeState,
      numFilterId: numFilterId + 1,
      /* filterColumn: colOptios[0] ?? '', */
      numberFilters: [...numberFilters,
        { col: filterColumn, op: filterOperador, val: valueFilter, id: numFilterId }],
      results: newMultipleFilter(dataContext.results, [...numberFilters, {
        col: filterColumn, op: filterOperador, val: valueFilter, id: numFilterId,
      }]),
      [name]: '',
    });
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
        /* filterColumn: colOptios[0] ?? '', */
        results: newMultipleFilter(dataContext.results, numberFilters
          .filter((e) => e.id !== Number(value))),
      });
      break;
    default:
      setColOptions(filterColumnsOptions);
      setHomeState({
        numberFilters: [],
        filterColumn: 'population',
        results: dataContext.results,
      });
    }
  };

  return (
    <>
      <h1>Hello Home </h1>
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
          Remover Filtros
        </button>
        <div>
          {selectModel({
            arrayOptions: filterColumnsOptions,
            name: 'column',
            dataTest: 'column-sort',
            label: 'Ordenar',
            value: sortState.column,
            onChange: handlerSort,
          })}

          {radioButonModel({
            id: 'asc',
            dataTest: 'column-sort-input-asc',
            type: 'radio',
            name: 'sort',
            value: 'ASC',
            label: 'Ascendente',
            onChange: handlerSort })}

          {radioButonModel({
            id: 'desc',
            dataTest: 'column-sort-input-desc',
            type: 'radio',
            name: 'sort',
            value: 'DESC',
            label: 'Descendente',
            onChange: handlerSort })}
          <button
            type="submit"
            data-testid="column-sort-button"
            onClick={ btnSortMap }
          >
            ORDENAR
          </button>
        </div>
      </div>
      <div>
        { numberFilters.map((e) => (
          <div key={ Math.random() }>
            <p data-testid="filter">
              { `${e.col} ${e.op} ${e.val}` }
              <button
                name="btnRemoveFilter"
                type="submit"
                dataTest="numb-filter-remove"
                value={ e.id }
                onClick={ handlerFilter }
              >
                remove
              </button>
            </p>
          </div>
        ))}
      </div>
      <table border="1">
        <tbody>
          <tr>{nameIndices.map((e) => <th key={ e }>{e}</th>)}</tr>
          {homeState.results
            .map((e) => (
              <tr key={ Math.random() }>
                {Object.keys(e).map((i) => (
                  <th
                    data-testid={ (i === 'name') ? 'planet-name' : '' }
                    key={ Math.random() }
                  >
                    {Array.isArray(e[i]) ? arrayToString(e[i]) : e[i]}
                  </th>))}
              </tr>)) }
        </tbody>
      </table>
    </>
  );
}

export default Home;
