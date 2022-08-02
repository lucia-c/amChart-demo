import { FC, useId, useLayoutEffect, useState } from "react";
import ChartCreation from "../../common/hooks/chart.hook";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { allThemes } from ".././custom-theme";
import * as am5percent from "@amcharts/amcharts5/percent";
import { Container, Row, Col, Form } from "react-bootstrap";
import { PieData, PieSlicedDataSeries } from "../../utils/mock";

export enum PieSlicedSeriesEnums {
  pie = "pie",
  sliced = "sliced",
}

const PieSeries: PieSlicedSeriesEnums[] = [
  PieSlicedSeriesEnums.pie,
  PieSlicedSeriesEnums.sliced,
];

export type PieChartProps = {
  data: PieSlicedDataSeries;
  changePieSlicedSeries?: (PieSlicedSeriesEnums) => void;
};

const PieChart: FC<PieChartProps> = ({ data, changePieSlicedSeries }) => {
  const chartId = useId();
  const [chartState, setChartState] = useState<number>(0);
  const [chartData, setChartData] = useState<PieData[]>([]);
  const [chartSeries, setChartSeries] = useState<PieSlicedSeriesEnums>(
    PieSlicedSeriesEnums.pie
  );

  const { initContainer, initLegend, generateLabel } = ChartCreation();

  useLayoutEffect(() => {
    setChartData(data[PieSeries[0]]);

    let root: am5.Root = am5.Root.new(chartId);

    const customTheme = am5.Theme.new(root);

    customTheme.rule("Label").setAll(allThemes.allianz);

    // Set themes from select list
    // https://www.amcharts.com/docs/v5/concepts/themes/
    let actualThemes: am5.Theme[] = [am5themes_Animated.new(root), customTheme];
    root.setThemes(actualThemes);

    let container = initContainer(root);

    const labeSettings: Partial<am5.ILabelSettings> = generateLabel({
      text: "[bold]{category}[/]\n{value}",
    });

    let chart;
    let series;
    let xPercentage;
    switch (chartSeries) {
      case PieSlicedSeriesEnums.pie:
        chart = container.children.push(
          am5percent.PieChart.new(root, {
            layout: root.verticalLayout,
          })
        );
        series = chart.series.push(
          am5percent.PieSeries.new(root, {
            name: "Series",
            valueField: "value",
            categoryField: "label",
          })
        );
        xPercentage = 40;
        break;
      case PieSlicedSeriesEnums.sliced:
        chart = container.children.push(
          am5percent.SlicedChart.new(root, {
            layout: root.verticalLayout,
          })
        );
        series = chart.series.push(
          am5percent.FunnelSeries.new(root, {
            name: "Series",
            valueField: "value",
            categoryField: "label",
            orientation: "vertical",
            alignLabels: true,
            bottomRatio: 1,
            width: am5.percent(90),
          })
        );
        xPercentage = 88;
        break;
      default:
        break;
    }

    series.labels.template.setAll(labeSettings);
    series.data.setAll(chartData);
    series.appear();

    let legend = series.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(xPercentage),
        layout: root.verticalLayout,
      })
    );

    legend.data.setAll(series.dataItems);

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

  const changeSeries = (newSerie) => {
    console.log(newSerie);
    setChartSeries(newSerie);
    changePieSlicedSeries && changePieSlicedSeries(newSerie);
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <Form.Select
              aria-label="pie and sliced series type"
              onChange={(event) =>
                changeSeries(PieSlicedSeriesEnums[event.target.value])
              }
              value={chartSeries}
            >
              <option>Select chart series</option>
              {PieSeries.map((serie) => {
                return (
                  <option value={serie} key={serie}>
                    {serie}
                  </option>
                );
              })}
            </Form.Select>
          </Col>
        </Row>
        <Row>
          <Col>
            <div id={chartId} style={{ width: "100%", height: "500px" }}></div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default PieChart;
