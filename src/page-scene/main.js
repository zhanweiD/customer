import {Route, Switch, Redirect} from 'react-router-dom'
import SceneList from './scene'
import SceneDetail from './scene-detail'

const prePath = '/scene'

export default () => {
  return (
    <Switch>
      <Route exact path={`${prePath}/list`} component={SceneList} />
      <Route exact path={`${prePath}/list/:sceneId/:projectId?`} component={SceneDetail} /> 
      {/* <Redirect strict to={`${prePath}`} /> */}
    </Switch>
  )
}
