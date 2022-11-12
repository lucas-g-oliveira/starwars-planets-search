import React from 'react';
import { screen } from '@testing-library/react';
import App from '../App';
import userEvent from '@testing-library/user-event';
import renderWithContext from './renderWithContext';
import testData from '../../cypress/mocks/testData';
import { act } from 'react-dom/test-utils';

describe('Testa se os botões, inputs e a tabela de planetas são redenrizados e seus comportamentos', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Verifica se os inputs estão presentes na aplicação', async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(testData),
    }))

    await act(async () => {renderWithContext(<App />);})
    
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

    expect(planetName[0]).toHaveTextContent('Tatooine');
    expect(planetName[9]).toHaveTextContent('Kamino');

    userEvent.type(inpSeach,'N');
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(1);
    userEvent.clear(inpSeach);

    userEvent.type(inpSeach,'n');
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(7);
    userEvent.clear(inpSeach);

    expect(screen.queryAllByTestId('planet-name')).toHaveLength(10);

    expect(screen.queryAllByTestId('planet-name')[0]).toHaveTextContent('Tatooine');

    userEvent.selectOptions(colSortFilt, 'rotation_period');
    userEvent.click(radButonASC);
    userEvent.click(bntSortTable);
    expect(screen.queryAllByTestId('planet-name')[0]).toHaveTextContent('Bespin');

    userEvent.selectOptions(colSortFilt, 'surface_water');
    userEvent.click(radButonDESC);
    userEvent.click(bntSortTable);
    expect(screen.queryAllByTestId('planet-name')[9]).toHaveTextContent('Coruscant');

    userEvent.selectOptions(selColumn, 'surface_water');
    userEvent.selectOptions(selOperation, 'menor que');
    userEvent.type(valFiltOperat, '100');
    userEvent.click(btnNumberFilter);
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(7);
  
    userEvent.clear(valFiltOperat);

    userEvent.selectOptions(selColumn, 'population');
    userEvent.selectOptions(selOperation, 'maior que');
    userEvent.type(valFiltOperat, '200000');
    userEvent.click(btnNumberFilter);
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(4);

    userEvent.clear(valFiltOperat);

    userEvent.selectOptions(selColumn, 'diameter');
    userEvent.selectOptions(selOperation, 'igual a');
    userEvent.type(valFiltOperat, '4900');
    userEvent.click(btnNumberFilter);
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(1);
    expect(screen.queryAllByTestId('planet-name')[0]).toHaveTextContent('Endor');

    const butonsRemoveFilter = screen.getAllByText('remove');
    expect(butonsRemoveFilter).toHaveLength(3);

    userEvent.click(butonsRemoveFilter[2]);
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(4);

    userEvent.click(btnRemAllFilt);
    expect(screen.queryAllByTestId('planet-name')).toHaveLength(10);
  });
})
