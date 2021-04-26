import {asyncComponent} from '../../../../common/util'
import './main.styl'

export default asyncComponent(async () => {
  try {
    const module = await import('./main')
    return module.default
  } catch (error) {
    console.log(error)
  }
  return null
})
