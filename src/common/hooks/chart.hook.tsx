import { useEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { XYSeriesEnums } from "../../components/xy-chart";

const ChartCreation = (
  root?: am5.Root,
  series?: XYSeriesEnums
): {
  //xAxis: am5xy.CategoryAxis<am5xy.AxisRenderer> | am5xy.DateAxis<am5xy.AxisRenderer>;
  chart: am5xy.XYChart | undefined;
  //legend: am5.Legend | undefined;
  initChart: (root: am5.Root) => am5xy.XYChart;
  initContainer: (root: am5.Root) => am5.Container;
  initLegend: (root: am5.Root, settings?: am5.ILegendSettings) => am5.Legend;
  generateLabel: (settings: am5.ILabelSettings) => Partial<am5.ILabelSettings>;
  primaryKey: string;
} => {
  const [chart, setChart] = useState<am5xy.XYChart>();
  const [primaryKey, setPrimaryKey] = useState<string>(getPrimaryKey());

  const initChart = (root: am5.Root): am5xy.XYChart => {
    return root?.container?.children.push(
      am5xy.XYChart.new(root, {
        panX: true,
        panY: false,
        wheelX: "panX",
        wheelY: "zoomX",
        layout: root.verticalLayout,
      })
    );
  };
  const initContainer = (root: am5.Root): am5.Container => {
    return root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout,
      })
    );
  };
  const initLegend = (
    root: am5.Root,
    settings?: am5.ILegendSettings
  ): am5.Legend => {
    return am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      ...settings,
    });
  };

  const generateLabel = (
    settings: am5.ILabelSettings
  ): Partial<am5.ILabelSettings> => {
    return {
      fontSize: 14,
      //fill: am5.color(0x550000),
      oversizedBehavior: "truncate",
      breakWords: true,
      textAlign: "center",
      lineHeight: 1.5,
      populateText: true,
      ...settings,
    };
  };

  function getPrimaryKey(seriesType?: string): string {
    let seriePrimaryKey = "category";
    switch (seriesType) {
      case XYSeriesEnums.Column:
        seriePrimaryKey = "category";
        break;
      case XYSeriesEnums.Line:
        seriePrimaryKey = "year";
        break;
      case XYSeriesEnums.Step:
        seriePrimaryKey = "date";
        break;
    }
    return seriePrimaryKey;
  }

  useEffect(() => {
    if (root) {
      setChart(initChart(root));
    }
    setPrimaryKey(getPrimaryKey(series));
  }, [chart, root, series]);

  return {
    chart,
    initChart,
    initContainer,
    initLegend,
    generateLabel,
    primaryKey,
  };
};
export default ChartCreation;
