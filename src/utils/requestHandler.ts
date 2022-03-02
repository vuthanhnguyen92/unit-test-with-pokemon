import getErrorMessage from './errorHandler'

export async function get(url: string) {
  try {
    const response = await fetch(url)
    const data = await response.json()
    if (response.status !== 200) {
      return {
        error: getErrorMessage(data.message)
      }
    }
    return { data }
  } catch (error: any) {
    return {
      error: getErrorMessage(error)
    }
  }
}
