import '@testing-library/jest-dom'

jest.mock('lucide-react', () => ({
  BookX: () => null,
  CookingPot: () => null,
  HandCoins: () => null,
  Loader: () => null,
  Truck: () => null,
}))

process.env.NEXT_PUBLIC_API_ENDPOINT =
  'http://localhost:3000'

process.env.NEXT_PUBLIC_URL =
  'http://localhost:3000'

process.env.DOCKER_PUBLIC_API_ENDPOINT =
  'http://localhost:3000'