import HeroRepository from '../repositories/heroRepository.js'
import HeroService from '../services/heroService.js'

const generateInstance = ({ filePath }) => {
  const heroRepository = new HeroRepository({
    file: filePath,
  })
  const heroService = new HeroService({
    heroRepository,
  })

  return heroService
}

export { generateInstance }
