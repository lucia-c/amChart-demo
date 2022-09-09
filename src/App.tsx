import React, { useState } from "react";
import Button from "./components/button";
import Home from "./pages/home";
import "./App.scss";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Stack } from "react-bootstrap";
import ChartHome from "./pages/chartHome";

export type ChartProps = {
  id: string;
  label: string;
  theme?: string;
};

const charts: ChartProps[] = [
  {
    id: "line",
    label: "Line Chart",
  },
  {
    id: "xy",
    label: "XY charts",
  },
  {
    id: "hierarchy",
    label: "Hierarchy charts",
  },

  {
    id: "pieAndSliced",
    label: "Pie and Sliced Charts",
  }
];

function App() {
  const [chartType, setChartType] = useState<ChartProps>(charts[1]);

  const changeChartDemo = (id) => {
    const selected = charts.find((chart: ChartProps) => chart.id === id);
    if (!!selected) {
      setChartType(selected);
    }
    console.log("chart selected ", chartType);
  };

  return (
    <div className="App">
      <Container>
        <Row className="justify-content-md-center">
          <Col>
            <h2 className="titolo display-4">Charts Demo</h2>
          </Col>
        </Row>
        <Row className="justify-content-md-center mb-4">
          <Col xs="auto">
            <Stack direction="horizontal" gap={3}>
              {charts.filter((chart) => chart.id !== 'line').map((chart, index) => {
                const { id } = chart; //destrutturazione
                return (
                  <Button
                    key={id}
                    {...chart}
                    disabled={chartType.id === chart.id}
                    onClick={() => changeChartDemo(chart.id)}
                    size={"lg"}
                  ></Button>
                );
              })}
            </Stack>
          </Col>
        </Row>
        <Row>
          <Col>
            <ChartHome chartType={chartType} />
            {/* <Home chartType={chartType} /> */}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
