import React from 'react'
import { render, screen } from '@testing-library/react'
import nock from 'nock'

import PokemonCard from '.'
import * as pokemonAPIs from '../../apis/pokemon/api'
import { API_URL } from '../../utils/constants'

describe('Mocked functions', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  //spy on `getPokemonByUrl` which is the main API call
  const spy = jest.spyOn(pokemonAPIs, 'getPokemonByUrl')
  //restore to the original behavior after all tests ran
  afterAll(() => {
    spy.mockRestore()
  })

  it('Should render pokemon card', async () => {
    const mockedFunction = jest.fn(async () => ({
      data: {
        name: 'bulbasaur',
        sprites: {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
        }
      }
    }))
    spy.mockImplementationOnce(mockedFunction)

    render(<PokemonCard url={`${API_URL}/api/v2/pokemon/1`} />)

    expect(mockedFunction).toHaveBeenCalledTimes(1)
    expect(mockedFunction).toHaveBeenCalledWith(`${API_URL}/api/v2/pokemon/1`)

    const loadingComponent = screen.getByTestId('pokemon-card-loading')
    expect(loadingComponent).toBeTruthy()

    const loadedComponent = await screen.findByTestId('pokemon-card')
    expect(loadedComponent).toBeTruthy()

    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
  })

  it('Should render pokemon card error', async () => {
    const mockedFunction = jest.fn(async () => ({
      error: 'Unable to load'
    }))
    spy.mockImplementationOnce(mockedFunction)
    render(<PokemonCard url={`${API_URL}/api/v2/pokemon/1`} />)

    const loadingComponent = screen.getByTestId('pokemon-card-loading')
    expect(loadingComponent).toBeTruthy()

    expect(mockedFunction).toHaveBeenCalledTimes(1)
    expect(mockedFunction).toHaveBeenCalledWith(`${API_URL}/api/v2/pokemon/1`)

    const loadedComponent = await screen.findByTestId('pokemon-card-error')
    expect(loadedComponent).toBeTruthy()
    expect(screen.getByText('Unable to load')).toBeTruthy()
  })
})

//nock
//fetch-mock
//axios-mock-adapter
//msw
describe('Mocked requests', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('Should render pokemon card', async () => {
    nock(API_URL)
      .get(/api\/v2\/pokemon\/[0-9]+/)
      .once()
      .reply(
        200,
        {
          name: 'bulbasaur',
          sprites: {
            front_default:
              'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
          }
        },
        {
          'Access-Control-Allow-Origin': '*'
        }
      )

    render(<PokemonCard url={`${API_URL}/api/v2/pokemon/1`} />)

    const loadingComponent = screen.getByTestId('pokemon-card-loading')
    expect(loadingComponent).toBeTruthy()

    const loadedComponent = await screen.findByTestId('pokemon-card')
    expect(loadedComponent).toBeTruthy()

    expect(screen.getByText('bulbasaur')).toBeInTheDocument()
  })

  it('Should render pokemon card error', async () => {
    nock(API_URL)
      .get(/api\/v2\/pokemon\/[0-9]+/)
      .once()
      .reply(
        500,
        {
          message: 'Unable to load'
        },
        {
          'Access-Control-Allow-Origin': '*'
        }
      )

    render(<PokemonCard url={`${API_URL}/api/v2/pokemon/1`} />)

    const loadingComponent = screen.getByTestId('pokemon-card-loading')
    expect(loadingComponent).toBeTruthy()

    const loadedComponent = await screen.findByTestId('pokemon-card-error')
    expect(loadedComponent).toBeTruthy()
    expect(screen.getByText('Unable to load')).toBeTruthy()
  })
})
