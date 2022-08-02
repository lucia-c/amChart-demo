import { useEffect, useState } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import { XYSeriesEnums } from '../../components/xy-chart';
import { AxisRenderer, CategoryAxis, DateAxis, IXYChartSettings, ValueAxis } from '@amcharts/amcharts5/xy';

export enum ChartCategories {
  xy = 'xy',
  hierarchy = 'hierarchy'
}

export enum AxisDataTypes {
  date = 'date',
  category = 'category'
}

const ChartCreation = (
  root?: am5.Root
): {
  initChart: (root: any, category: ChartCategories, customSettings?: IXYChartSettings) => am5xy.XYChart;
  initContainer: (root: am5.Root) => am5.Container;
  initLegend: (root: any, settings?: am5.ILegendSettings) => am5.Legend;
  initPrimaryKey: (seriesType?: XYSeriesEnums) => string;
  generateLabel: (settings: am5.ILabelSettings) => Partial<am5.ILabelSettings>;
  generateXAxe: (root: am5.Root, chart, primaryField: string, type?: string) => CategoryAxis<AxisRenderer> | DateAxis<AxisRenderer>;
  generateYAxe: (root: am5.Root, chart) => ValueAxis<AxisRenderer>;
  primaryKey: string;
} => {
  const [primaryKey, setPrimaryKey] = useState<string>('category');

  const initChart = (root: am5.Root, category: ChartCategories, customSettings?: IXYChartSettings): am5xy.XYChart => {
    const settings: IXYChartSettings = {
      panX: true,
      panY: false,
      wheelX: "panX",
      wheelY: "zoomX",
      layout: root.verticalLayout,
      ...customSettings
    }
    let chartInit: am5xy.XYChart;

    switch (category) {
      case ChartCategories.xy:
        chartInit = am5xy.XYChart.new(root, settings);
        break;
      default:
        chartInit = am5xy.XYChart.new(root, settings);
        break;
    }
    return root?.container?.children.push(chartInit)
  }


  const initContainer = (root: am5.Root): am5.Container => {
    return root.container.children.push(
      am5.Container.new(root, {
        width: am5.percent(100),
        height: am5.percent(100),
        layout: root.verticalLayout
      })
    );
  }

  // Add legend
  // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
  const initLegend = (root: am5.Root, settings?: am5.ILegendSettings): am5.Legend => {
    return am5.Legend.new(root, {
      centerX: am5.p50,
      x: am5.p50,
      ...settings
    })

  }

  const generateLabel = (settings: am5.ILabelSettings): Partial<am5.ILabelSettings> => {
    return {
      fontSize: 14,
      //fill: am5.color(0x550000),
      oversizedBehavior: 'truncate',
      breakWords: true,
      textAlign: "center",
      lineHeight: 1.5,
      populateText: true,
      ...settings
    }
  }

  const initPrimaryKey = (seriesType?: XYSeriesEnums): string => {
    let seriePrimaryKey = 'category';
    switch (seriesType) {
      case XYSeriesEnums.Column:
        seriePrimaryKey = 'category';
        break;
      case XYSeriesEnums.Line:
        seriePrimaryKey = 'year';
        break;
      case XYSeriesEnums.Step:
        seriePrimaryKey = 'date';
        break;
    }
    setPrimaryKey(seriePrimaryKey);
    return seriePrimaryKey;
  }

  const generateXAxe = (root: am5.Root, chart: am5xy.XYChart, primaryField: string, type?: AxisDataTypes): CategoryAxis<AxisRenderer> | DateAxis<AxisRenderer> => {
    let xAxis: CategoryAxis<AxisRenderer> | DateAxis<AxisRenderer>;
    switch (type) {
      case AxisDataTypes.date:
        xAxis = chart.xAxes.push(am5xy.DateAxis.new(root, {
          baseInterval: { timeUnit: "day", count: 1 },
          renderer: am5xy.AxisRendererX.new(root, {
            minGridDistance: 20
          }),
        }));
        break;
      default:
        xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
          categoryField: primaryField,
          renderer: am5xy.AxisRendererX.new(root, {
            cellStartLocation: 0.1,
            cellEndLocation: 0.9
          }),
          tooltip: am5.Tooltip.new(root, {}),
          maxDeviation: 0.2,
        }));
        break;
    }

    return xAxis;
  }

  // Create Y-axis
  const generateYAxe = (root: am5.Root, chart: am5xy.XYChart): ValueAxis<AxisRenderer> => {
    let yAxis: ValueAxis<AxisRenderer> = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, {}),
      })
    );

    return yAxis;
  }




  useEffect(() => {
    if (root) {
      console.log('root chart')
      // setChart(initChart(root, category, series));
    }

  }, [root]);

  return {
    initChart,
    initContainer,
    initLegend,
    initPrimaryKey,
    generateLabel,
    generateXAxe,
    generateYAxe,
    primaryKey
  };
};
export default ChartCreation;
