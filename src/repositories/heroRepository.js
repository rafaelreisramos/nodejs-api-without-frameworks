import { readFile, writeFile } from 'node:fs/promises'

export default class HeroRepository {
  constructor({ file }) {
    this.file = file
  }

  async #currentFileContent() {
    return JSON.parse(await readFile(this.file, { encoding: 'utf-8' }))
  }

  find() {
    return this.#currentFileContent()
  }

  async findById(id) {
    const currentFile = await this.#currentFileContent()
    const pos = currentFile.findIndex((hero) => hero.id === id)
    if (pos < 0) {
      return Promise.resolve(null)
    }
    return currentFile[pos]
  }

  async findByName(name) {
    const currentFile = await this.#currentFileContent()
    const pos = currentFile.findIndex((hero) => hero.name === name)
    if (pos < 0) {
      return Promise.resolve(null)
    }
    return currentFile[pos]
  }

  async create(data) {
    const currentFile = await this.#currentFileContent()
    currentFile.push(data)
    await writeFile(this.file, JSON.stringify(currentFile))

    return data.id
  }

  async update(id, item) {
    const currentFile = await this.#currentFileContent()
    const pos = currentFile.findIndex((hero) => hero.id === id)
    currentFile[pos] = { ...currentFile[pos], ...item }
    await writeFile(this.file, JSON.stringify(currentFile))

    return currentFile[pos]
  }

  async delete(id) {
    const currentFile = await this.#currentFileContent()
    const updatedFile = currentFile.filter((hero) => hero.id !== id)
    await writeFile(this.file, JSON.stringify(updatedFile))
  }
}
