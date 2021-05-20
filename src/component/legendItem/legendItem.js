const LegendItem = ({title, percent, counts, color}) => {
  return (
    <div className="categroy-legend-item FBH FBAC">
      <div className="legend-name">
        <span style={{background: color}} className="legend-name-icon mr4" />
        <span>{title}</span>
      </div>
      <div className="legend-bar ml4">
        <div className="legend-bar-inner" style={{width: percent}} />
      </div>
      <span className="c45 ml4 mr4">{percent}</span>
      <span className="c45">|</span>
      <span className="ml4 c45">{counts}</span>
    </div>
  )
}
export default LegendItem
