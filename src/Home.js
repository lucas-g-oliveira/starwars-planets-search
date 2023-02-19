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
    if (name === 'filterWord') {
      filterWordFx(name, value);
    }
    switch (name) {
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
    case 'btnRemoveFilters':
      setColOptions(filterColumnsOptions);
      setHomeState({
        numberFilters: [],
        filterColumn: 'population',
        results: dataContext.results,
      });
      break;
    default:
    }
  };

  return (
    <div className="home-body">
      <h1>Star Wars - Planets Informations </h1>
      <div className="div-filters">
        <input
          data-testid="name-filter"
          name="filterWord"
          type="text"
          placeholder="Search"
          value={ homeState.filterWold }
          onChange={ handlerFilter }
        />

        <div>
          {selectModel({
            arrayOptions: colOptios,
            dataTest: 'column-filter',
            label: '',
            name: 'filterColumn',
            value: homeState.filterColumn,
            onChange: handlerChangeBasic,
          })}

          {selectModel({
            arrayOptions: compFilter,
            dataTest: 'comparison-filter',
            label: '',
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
        </div>
        <button
          name="btnRemoveFilters"
          type="submit"
          data-testid="button-remove-filters"
          onClick={ handlerFilter }
        >
          Remover Filtros
        </button>
        <div className="radio-b">

          {selectModel({
            arrayOptions: filterColumnsOptions,
            name: 'column',
            dataTest: 'column-sort',
            label: '',
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
      <br />
      <section className="filt-col-sect">
        { numberFilters.map((e) => (
          <div
            className="filter-col"
            key={ Math.random() }
          >
            <p
              data-testid="filter"
            >
              { `${e.col} ${e.op} ${e.val}` }
              <button
                className="material-symbols-outlined"
                name="btnRemoveFilter"
                type="submit"
                dataTest="numb-filter-remove"
                value={ e.id }
                onClick={ handlerFilter }
              >
                delete
              </button>
            </p>
          </div>
        ))}
      </section>
      <section>
        <table
          width="1024px"
        >
          <tbody>
            <tr>{nameIndices.map((e) => <th className="th-title" key={ e }>{e}</th>)}</tr>
            {homeState.results
              .map((e) => (
                <tr key={ Math.random() }>
                  {Object.keys(e).map((i) => (
                    <th
                      data-testid={ (i === 'name') ? 'planet-name' : '' }
                      key={ Math.random() }
                    >
                      <n>{Array.isArray(e[i]) ? arrayToString(e[i]) : e[i]}</n>
                    </th>))}
                </tr>)) }
          </tbody>
        </table>
      </section>
    </div>
  );
}
export default Home;
