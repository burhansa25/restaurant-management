import fs from 'fs'
import path from 'path'

import { createFolder, randomId } from '@/utils/helpers'

describe('Helpers Utility', () => {
  const testFolder = path.join(__dirname, 'temp-folder')

  afterAll(() => {
    if (fs.existsSync(testFolder)) {
      fs.rmSync(testFolder, {
        recursive: true,
        force: true
      })
    }
  })

  it('should generate unique random id', () => {
    const id1 = randomId()
    const id2 = randomId()

    expect(id1).toBeDefined()
    expect(id2).toBeDefined()
    expect(id1).not.toBe(id2)
  })

  it('should create folder', () => {
    createFolder(testFolder)

    expect(fs.existsSync(testFolder)).toBe(true)
  })

  it('should not create folder if already exists', () => {
    const existsSpy = jest.spyOn(fs, 'existsSync')
    const mkdirSpy = jest.spyOn(fs, 'mkdirSync')

    existsSpy.mockReturnValue(true)

    createFolder('uploads')

    expect(mkdirSpy).not.toHaveBeenCalled()

    existsSpy.mockRestore()
    mkdirSpy.mockRestore()
  })
})
