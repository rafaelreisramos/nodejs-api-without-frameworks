export default class HeroService {
  constructor({ heroRepository }) {
    this.heroRepository = heroRepository
  }

  find() {
    return this.heroRepository.find()
  }

  findById(id) {
    return this.heroRepository.findById(id)
  }

  findByName(name) {
    return this.heroRepository.findByName(name)
  }

  create(data) {
    return this.heroRepository.create(data)
  }

  update(id, item) {
    return this.heroRepository.update(id, item)
  }

  delete(id) {
    return this.heroRepository.delete(id)
  }
}
