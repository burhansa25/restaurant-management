import { socketInstance } from '@/lib/socket'
import { io } from 'socket.io-client'

jest.mock('socket.io-client', () => ({
  io: jest.fn(),
}))

describe('socketInstance', () => {
  it('should create socket with bearer token', () => {
    socketInstance('abc123')

    expect(io).toHaveBeenCalled()
  })
})