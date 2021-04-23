import {Route, Switch} from 'react-router-dom'
import SceneList from './page-scene-manage'
import SceneDetail from './page-scene-detail'

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
