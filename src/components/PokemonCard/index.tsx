import React, { FC, useState, useEffect } from 'react'
import Card from 'react-bootstrap/Card'
import Spinner from 'react-bootstrap/Spinner'
import './styles.scss'
import { IPokemon } from './types'
import { getPokemonByUrl } from '../../apis/pokemon/api'

type Props = {
  url: string
}

const PokemonCard: FC<Props> = (props) => {
  const [pokemon, setPokemon] = useState<IPokemon>()
  const [errorMessage, setErrorMessage] = useState<string>()
  useEffect(() => {
    getPokemon()
  }, [])

  const getPokemon = async () => {
    const response = await getPokemonByUrl(props.url)
    const { data, error } = response
    if (data) {
      setPokemon({
        image: data.sprites?.front_default,
        name: data.name
      })
    } else {
      setErrorMessage(error)
    }
  }

  if (errorMessage) {
    return (
      <Card className="pokemon-card-error" data-testid="pokemon-card-error">
        {errorMessage}
      </Card>
    )
  }

  if (!pokemon) {
    return (
      <Card className="pokemon-card-loading" data-testid="pokemon-card-loading">
        <Spinner animation="border" role="status" className="styled-spinner">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Card>
    )
  }

  return (
    <Card className="pokemon-card" data-testid="pokemon-card">
      <Card.Img variant="top" src={pokemon.image} />
      <Card.Body>
        <Card.Title>{pokemon.name}</Card.Title>
      </Card.Body>
    </Card>
  )
}

export default PokemonCard
