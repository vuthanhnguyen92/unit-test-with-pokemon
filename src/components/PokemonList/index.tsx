import { FC, useState, useEffect } from 'react'
import Stack from 'react-bootstrap/Stack'
import Spinner from 'react-bootstrap/Spinner'
import PokemonCard from './../PokemonCard'
import './styles.scss'
import { IPokemonResult } from './types'
import { getAllPokemons } from '../../apis/pokemon/api'

const PokemonList: FC = () => {
  const [pokemonList, setPokemonList] = useState<IPokemonResult[]>([])
  const [errorMessage, setErrorMessage] = useState<string>()
  useEffect(() => {
    getPokemonList()
  }, [])

  const getPokemonList = async () => {
    const { data, error } = await getAllPokemons()
    if (data) {
      setPokemonList(data.results)
    } else {
      setErrorMessage(error)
    }
  }

  if (errorMessage) {
    return (
      <div className="full-screen">
        <span className="pokemon-list-error" data-testid="pokemon-list-error">
          {errorMessage}
        </span>
      </div>
    )
  }

  if (!pokemonList || pokemonList.length === 0) {
    return (
      <div className="full-screen-loading">
        <Spinner
          animation="border"
          role="status"
          className="pokemon-list-loading"
          data-testid="pokemon-list-loading">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className="pokemon-list" data-testid="pokemon-list">
      <Stack direction="horizontal" gap={3}>
        {pokemonList.map((pokemon) => (
          <PokemonCard key={pokemon.name} url={pokemon.url}></PokemonCard>
        ))}
      </Stack>
    </div>
  )
}

export default PokemonList
