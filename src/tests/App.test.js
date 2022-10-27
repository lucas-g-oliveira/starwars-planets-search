import React from 'react';
import { screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import renderWithContext from './renderWithContext';
import testData from '../../cypress/mocks/testData';
import { act } from 'react-dom/test-utils';

describe('Testa se os botões, inputs e a tabela de planetas são redenrizados e seus comportamentos', () => {
  afterEach(() => {
  jest.clearAllMocks();
});


  it('Verifica se os inputs estão presentes na aplicação', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(testData),
    }))

    await act(async () => {
      renderWithContext(<App />);
    })
    
    expect(global.fetch).toHaveBeenCalled();

    const inpSeach = screen.getByTestId('name-filter');
    const selColumn = screen.getByTestId('column-filter');
    const selOperation = screen.getByTestId('comparison-filter');
    const valFiltOperat = screen.getByTestId("value-filter");
    const btnNumberFilter = screen.getByTestId('button-filter');
    const btnRemAllFilt = screen.getByTestId('button-remove-filters');
    const colSortFilt = screen.getByTestId('column-sort');
    const radButonASC = screen.getByTestId('column-sort-input-asc');
    const radButonDESC = screen.getByTestId('column-sort-input-desc');
    const bntSortTable = screen.getByTestId('column-sort-button');
    const table = screen.getByRole('table');
    const planetName = screen.queryAllByTestId('planet-name');

    expect(inpSeach).toBeInTheDocument();
    expect(selColumn).toBeInTheDocument();
    expect(selOperation).toBeInTheDocument();
    expect(valFiltOperat).toBeInTheDocument();
    expect(btnNumberFilter).toBeInTheDocument();
    expect(btnRemAllFilt).toBeInTheDocument();
    expect(colSortFilt).toBeInTheDocument();
    expect(radButonASC).toBeInTheDocument();
    expect(radButonDESC).toBeInTheDocument();
    expect(bntSortTable).toBeInTheDocument();
    expect(table).toBeInTheDocument();
    expect(planetName).toHaveLength(10);
  });

  it('Verifica se a busca pelo nome funciona como esperado', async() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(testData)}))

    await act(async () => {renderWithContext(<App />)})

    const inpSearch = screen.getByTestId('name-filter');
    const planetQtd = screen.queryAllByTestId('planet-name');


    
    userEvent.type(inpSearch, 'N');
    expect(planetQtd).toHaveLength(1);
    
    userEvent.type(inpSearch, 'n');
    expect(planetQtd).toHaveLength(7);
  })
})
