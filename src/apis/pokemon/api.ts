import { get } from '../../utils/requestHandler'
export const getPokemonByUrl = async (url: string) => {
  return await get(url)
}

export const getAllPokemons = async () => {
  return await get('https://pokeapi.co/api/v2/pokemon?limit=1000')
}
