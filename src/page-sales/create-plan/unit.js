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
  start,
} from '../icon'

// 匹配icon
const matchingIcon = type => {
  let imgDom = []
  switch (type) {
    case 'weapp':
      imgDom = <img alt="" height={24} width={24} src={weapp} />
      break
    case 'weService':
      imgDom = <img alt="" height={24} width={24} src={weService} />
      break
    case 'email':
      imgDom = <img alt="" height={24} width={24} src={email} />
      break
    case 'sms':
      imgDom = <img alt="" height={24} width={24} src={sms} />
      break
    case 'eventBranch':
      imgDom = <img alt="" height={24} width={24} src={eventBranch} />
      break
    case 'tagBranch':
      imgDom = <img alt="" height={24} width={24} src={tagBranch} />
      break
    case 'copyBranch':
      imgDom = <img alt="" height={24} width={24} src={copyBranch} />
      break
    case 'waite':
      imgDom = <img alt="" height={24} width={24} src={waite} />
      break
    case 'start':
      imgDom = <img alt="" height={24} width={24} src={start} />
      break
    default:
      imgDom = <img alt="" height={24} width={24} src={end} />
      break
  }
  return imgDom
}
export default matchingIcon
