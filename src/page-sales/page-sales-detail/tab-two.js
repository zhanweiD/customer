import {useEffect} from 'react'

export default () => {
  useEffect(() => {
    console.log('tab two mount')
  }, [])

  return (
    <div>
      This is two
    </div>
  )
}
