import React, { Component } from 'react';
import "./index.scss"
import { pure } from 'recompose';
import PropTypes from 'prop-types';
import CalendarHeatmap from 'react-calendar-heatmap';
import ReactTooltip from 'react-tooltip';
import _forEach from 'lodash/forEach';
import _range from 'lodash/range';
import DividerTitle from 'Components/UI/DividerTitle';
import moment from 'moment';

const CalendarHeatmapActivity = (props) => {
  const {
    activity,
  } = props
  let noOfDay = 120
  let endDate = new Date()
  endDate.setHours(0,0,0,0)
  let startDate = new Date().setDate(endDate.getDate() - noOfDay)
  let dateCountList = new Array(noOfDay);
  const milisec = (1000*60*60*24)
  _forEach(activity, (activity, idx) => {
    let activityDate = new Date(activity[0])
    let dateIdx = Math.ceil((endDate - activityDate)/milisec)
    dateCountList[dateIdx] = {
      date: activity[0],
      count: activity[1],
    }
  })

  _forEach(_range(noOfDay), (val, idx) => {
    if(!dateCountList[idx]){
      let tmpDate = new Date()
      tmpDate.setDate(endDate.getDate() - val)
      tmpDate.setHours(0,0,0,0)
      let date = new Date(tmpDate);

      dateCountList[idx] = {
        date: moment(date).format("YYYY-MM-DD"),
        count: 0,
      }
    }
  })
  let defaultClass = "heatmap-day "
  console.log("####", dateCountList)
  return (
    <div className="div-calendarHeatmapActivity-wrapper">
      <DividerTitle
        iconName='braille'
        title='User Activity'
      />
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        values={dateCountList}
        classForValue={value => {
          if(value){
            if(value.count == 0){
              return defaultClass + `color-heatmap-0`
            }else if(value.count <= 4 && value.count > 0){
              return defaultClass + `color-heatmap-1`
            }else if(value.count <= 8 && value.count > 4){
              return defaultClass + `color-heatmap-2`
            }else if(value.count <= 12 && value.count > 8){
              return defaultClass + `color-heatmap-3`
            }else if(value.count <= 16 && value.count > 12){
              return defaultClass + `color-heatmap-4`
            }else if(value.count > 16){
              return defaultClass + `color-heatmap-5`
            }
          }
        }}
        showWeekdayLabels={true}
        gutterSize={4}
        tooltipDataAttrs={value => {
          let tmpDate = new Date(value.date)
          return {
            'data-tip': `${tmpDate.toGMTString().split(", ")[1].slice(0,11)}` +
            `<br/> Uploaded Images: ${value.count}`,
          };
        }}
      />
      <ReactTooltip className="ReactTooltip-heatmap" multiline/>
    </div>
  );
}
export default pure(CalendarHeatmapActivity);

CalendarHeatmapActivity.propTypes = {
  activity : PropTypes.arrayOf(
    PropTypes.array
  ),
}
