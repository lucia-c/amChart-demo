import { FC, useId, useLayoutEffect, useState } from "react";
import ChartCreation from "../../common/hooks/chart.hook";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import { allThemes } from ".././custom-theme";
import * as am5percent from "@amcharts/amcharts5/percent";
import { Container, Row, Col } from "react-bootstrap";
import { PieData, PieDataSeries } from "../../utils/mock";

export enum PieSeriesEnums {
  PIE = "pie",
}

const PieSeries: PieSeriesEnums[] = [PieSeriesEnums.PIE];

export type PieChartProps = {
  data: PieDataSeries;
};

const PieChart: FC<PieChartProps> = ({ data }) => {
  const chartId = useId();
  const [chartState, setChartState] = useState<number>(0);
  const [chartData, setChartData] = useState<PieData[]>([]);

  const { initContainer, initLegend, generateLabel } = ChartCreation();

  useLayoutEffect(() => {
    setChartData(data[PieSeries[0]]);
    console.log("***rendering***", chartData);

    //let root = am5.Root.new(chartRef.current as HTMLElement);
    let root: am5.Root = am5.Root.new(chartId);

    const customTheme = am5.Theme.new(root);

    customTheme.rule("Label").setAll(allThemes.allianz);

    // Set themes from select list
    // https://www.amcharts.com/docs/v5/concepts/themes/
    let actualThemes: am5.Theme[] = [am5themes_Animated.new(root), customTheme];
    root.setThemes(actualThemes);

    let container = initContainer(root);

    let chart = container.children.push(
      am5percent.PieChart.new(root, {
        layout: root.verticalLayout,
      })
    );

    const labeSettings: Partial<am5.ILabelSettings> = generateLabel({
      text: "[bold]{category}[/]\n{value}%",
    });

    let series = chart.series.push(
      am5percent.PieSeries.new(root, {
        name: "Series",
        valueField: "sales",
        categoryField: "country",
      })
    );

    series.labels.template.setAll(labeSettings);
    series.data.setAll(chartData);
    series.appear();

    let legend = series.children.push(
      am5.Legend.new(root, {
        centerX: am5.percent(50),
        x: am5.percent(35),
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

export default PieChart;
