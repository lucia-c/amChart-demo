/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC, useId, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import { circleItem, HierarchyDataSeries, XYdata } from "../utils/mock";
import { allThemes } from "./custom-theme";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import ChartCreation from "../common/hooks/chart.hook";

export enum HierarchySeriesEnums {
  Packed = "Packed",
}

const HierarchySeries: HierarchySeriesEnums[] = [HierarchySeriesEnums.Packed];

export type HierarchyProps = {
  data: HierarchyDataSeries;
  changeXYSerie?: (XYSeriesEnums) => void;
};

function fillByType(type: string): am5.Color {
  switch (type) {
    case "trend":
      return am5.color("#d553d5");
    case "team":
      return am5.color("#00aeff");
    default:
      return am5.color("#4e00df");
  }
}

//export default function XyChart(props ){
const HierarchyChart: FC<HierarchyProps> = ({ data }) => {
  const chartId = useId();
  const [chartState, setChartState] = useState<number>(0);
  const [chartData, setChartData] = useState<XYdata[]>([]);
  const { initContainer, initLegend, generateLabel } = ChartCreation();

  useLayoutEffect(() => {
    setChartData(data[HierarchySeries[0]]);
    console.log("***rendering***", chartState);

    //let root = am5.Root.new(chartRef.current as HTMLElement);
    let root: am5.Root = am5.Root.new(chartId);

    const customTheme = am5.Theme.new(root);

    customTheme.rule("Label").setAll(allThemes.allianz);

    // Set themes from select list
    // https://www.amcharts.com/docs/v5/concepts/themes/
    let actualThemes: am5.Theme[] = [am5themes_Animated.new(root), customTheme];
    root.setThemes(actualThemes);

    let container = initContainer(root);

    let series = container.children.push(
      am5hierarchy.Pack.new(root, {
        //singleBranchOnly: false,
        //downDepth: 10,
        topDepth: 2,
        //initialDepth: 10,
        valueField: "value",
        categoryField: "name",
        childDataField: "children",
      })
    );

    series.circles.template.setAll({
      fillOpacity: 0.7,
      strokeWidth: 1,
      strokeOpacity: 1,
      scale: 1,
    });

    series.circles.template.states.create("hover", {
      fillOpacity: 1,
      strokeOpacity: 0,
      strokeDasharray: 0,
      scale: 1.3,
    });

    // Force directed
    // series.outerCircles.template.states.create("disabled", {
    //     fillOpacity: 0.5,
    //     strokeOpacity: 0,
    //     strokeDasharray: 0
    // });

    // series.outerCircles.template.states.create("hover", {
    //     fillOpacity: 1,
    //     strokeOpacity: 0,
    //     strokeDasharray: 0,
    //     scale: 1.3
    // });
    // series.links.template.setAll({
    //     strokeWidth: 0,
    //     strokeOpacity: 0
    // });

    series.nodes.template.setAll({
      draggable: true,
      toggleKey: "none",
    });

    series.circles.template.adapters.add(
      "fill",
      function (fill, target: am5.Circle) {
        if (target && target.dataItem?.dataContext) {
          const item = target.dataItem?.dataContext as circleItem;
          return fillByType(item["type"] as string);
        }
      }
    );

    const labeSettings: Partial<am5.ILabelSettings> = generateLabel({
      text: "[bold]{category}[/]\n{value}%",
    });

    series.labels.template.setAll(labeSettings);
    series.data.setAll(chartData);
    series.set("selectedDataItem", series.dataItems[0]);
    series.appear();

    let legend = container.children.push(
      initLegend(root, { nameField: "name", fillField: "color" })
    );

    if (series?.dataItems && series?.dataItems[0] && legend) {
      legend.data.setAll(
        series?.dataItems[0]?.get("children").map((team) => {
          console.log(team);
          if (team && team.dataContext) {
            const item = team.dataContext as circleItem;
            return {
              name: item["name"],
              color: fillByType(item["type"] as string),
            };
          }
          return null;
        })
      );
    }

    // Make stuff animate on load
    // https://www.amcharts.com/docs/v5/concepts/animations/

    return () => {
      root.dispose();
      setChartState(1);
    };
  }, [
    chartData,
    chartId,
    chartState,
    data,
    generateLabel,
    initContainer,
    initLegend,
  ]);

  return (
    <>
      <Container>
        <Row>
          <Col>
            <div id={chartId} style={{ width: "100%", height: "500px" }}></div>
          </Col>{" "}
        </Row>
      </Container>
    </>
  );
};

export default HierarchyChart;
