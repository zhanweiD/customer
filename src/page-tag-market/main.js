import React from 'react'
import TagTree from './tag-tree'
import TagSearch from './tag-search'
import TagList from './tag-list'

export default () => {
  return (
    <div className="tag-market FBH">
      <TagTree />
      <div className="FB1" style={{backgroundColor: '#f8f8f8'}}>
        <TagSearch />
        <TagList />
      </div>
    </div>
  )
}
