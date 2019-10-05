import React, { Component } from 'react';
import CalendarHeatmapActivity from 'Components/UI/CalendarHeatmapActivity'
import CalendarHeatmap from 'react-calendar-heatmap';

let wrapper

let activity = [
  ["2019-09-19", 5], ["2019-09-25", 13]
]

describe("<CalendarHeatmapActivity />", () => {
  let calendarHeatmapNode, heatmapDayNodes
  beforeEach(() => {
    wrapper = mount(
      <CalendarHeatmapActivity
        activity={activity}
      />
    )
    calendarHeatmapNode = wrapper.find(CalendarHeatmap)
    heatmapDayNodes = calendarHeatmapNode.find(".heatmap-day")
  })

  it("120 days rect element", () => {
    expect(heatmapDayNodes.length).toBe(120)
  })

  it("Activities props are correctly shown on the heatmap", (done) => {
    setTimeout(() => {
      expect(calendarHeatmapNode.find(".color-heatmap-2").length).toBe(1)
      expect(calendarHeatmapNode.find(".color-heatmap-4").length).toBe(1)
      done()
    })
  })
})
