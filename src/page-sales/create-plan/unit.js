import {
  weapp,
  waite,
  weService,
  tagBranch,
  eventBranch,
  sms,
  end,
  email,
  copyBranch,
} from '../icon'

// 匹配icon
const matchingIcon = type => {
  let imgDom = []
  switch (type) {
    case 'weapp':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={weapp} />
      break
    case 'weService':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={weService} />
      break
    case 'email':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={email} />
      break
    case 'sms':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={sms} />
      break
    case 'eventBranch':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={eventBranch} />
      break
    case 'tagBranch':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={tagBranch} />
      break
    case 'copyBranch':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={copyBranch} />
      break
    case 'waite':
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={waite} />
      break
    default:
      imgDom = <img className="mt-4" alt="" height={24} width={24} src={end} />
      break
  }
  return imgDom
}
export default matchingIcon
