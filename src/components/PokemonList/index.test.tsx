import React from 'react'
import { render, screen } from '@testing-library/react'

import PokemonList from '.'
import * as pokemonAPIs from '../../apis/pokemon/api'

jest.mock('./../PokemonCard', () => () => (
  <div data-testid="pokemon-card">PokemonCard</div>
))

describe('Mocked functions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  //spy on `getAllPokemons` which is the main API call
  const spy = jest.spyOn(pokemonAPIs, 'getAllPokemons')
  //restore to the original behavior after all tests ran
  afterAll(() => {
    spy.mockRestore()
  })

  it('Should render pokemon list', async () => {
    const mockedFunction = jest.fn(async () => ({
      data: {
        results: [
          {
            name: 'bulbasaur',
            url: 'https://pokeapi.co/api/v2/pokemon/1/'
          },
          {
            name: 'ivysaur',
            url: 'https://pokeapi.co/api/v2/pokemon/2/'
          }
        ]
      }
    }))
    spy.mockImplementationOnce(mockedFunction)

    render(<PokemonList />)

    expect(mockedFunction).toHaveBeenCalledTimes(1)

    const loadingComponent = screen.getByTestId('pokemon-list-loading')
    expect(loadingComponent).toBeTruthy()

    const loadedComponent = await screen.findByTestId('pokemon-list')
    expect(loadedComponent).toBeTruthy()

    expect(screen.getAllByTestId('pokemon-card').length).toBe(2)
  })

  it('Should render pokemon list error', async () => {
    const mockedFunction = jest.fn(async () => ({
      error: 'Unable to load'
    }))
    spy.mockImplementationOnce(mockedFunction)
    render(<PokemonList />)

    const loadingComponent = screen.getByTestId('pokemon-list-loading')
    expect(loadingComponent).toBeTruthy()

    expect(mockedFunction).toHaveBeenCalledTimes(1)

    const loadedComponent = await screen.findByTestId('pokemon-list-error')
    expect(loadedComponent).toBeTruthy()
    expect(screen.getByText('Unable to load')).toBeTruthy()
  })
})
