import React, { FC } from "react";
import { ChartProps } from "../App";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import LineChart from "../components/charts/lineChart";

export type ChartHomeProps = {
  chartType: ChartProps;
};

const Home: FC<ChartHomeProps> = ({ chartType }) => {

  const renderSwitch = (param) => {
    console.log("render chart page", param);
    switch (param) {
      case "line":
        return (
          <Container>
            <Row>
              <Col>
                <LineChart />
              </Col>
            </Row>
          </Container>
        );
    }
  };


  return (
    <>
      <h3 className="title text-info">{chartType.label}</h3>
      {renderSwitch(chartType.id)}
    </>
  );
};

export default Home;
