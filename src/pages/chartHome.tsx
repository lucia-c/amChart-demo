import React, { FC, useState } from "react";
import { ChartProps } from "../App";
import Xy, { XYSeriesEnums } from "../components/xy-chart";
import "./chart.module.scss";
import ChartButton from "../components/button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Stack } from "react-bootstrap";
import charts_data, { ChartsData } from "../utils/mock";
import Hierarchy from "../components/hierarchy";
import PieChart, {
  PieSlicedSeriesEnums,
} from "../components/pieChart/pie-chart.component";

export type ChartHomeProps = {
  chartType: ChartProps;
};

let XYseriesCount = {
  Column: 3,
  Line: 3,
  Step: 5,
};
let XYseriesType = XYSeriesEnums.Column;
let PieAndSliceType = PieSlicedSeriesEnums.pie;
let data = charts_data;

const ChartHome: FC<ChartHomeProps> = ({ chartType }) => {
  const [allData, setAllData] = useState<ChartsData>(data);

  const renderSwitch = (param) => {
    console.log("render chart page", param);
    switch (param) {
      case "xy":
        return (
          <Container>
            <Row>
              <Col>
                {" "}
                <Xy
                  {...chartType}
                  data={allData[chartType.id]}
                  changeXYSerie={(serie) => (XYseriesType = serie)}
                />
              </Col>
              <Col sm={2}>
                <Stack gap={2}>
                  <ChartButton
                    label="add Series"
                    variant="success"
                    onClick={() => manageXYSeries()}
                  ></ChartButton>
                  <ChartButton
                    label="remove Series"
                    variant="warning"
                    disabled={XYseriesCount[XYseriesType] < 2}
                    onClick={() => manageXYSeries(true)}
                  ></ChartButton>
                </Stack>
              </Col>
            </Row>
          </Container>
        );
      case "pieAndSliced":
        return (
          <Container>
            <Row>
              <Col>
                <PieChart
                  {...chartType}
                  data={allData[chartType.id]}
                  changePieSlicedSeries={(serie) => (PieAndSliceType = serie)}
                />
              </Col>
            </Row>
          </Container>
        );
      case "hierarchy":
        return (
          <Container>
            <Row>
              <Col>
                {" "}
                <Hierarchy {...chartType} data={allData[chartType.id]} />
              </Col>
            </Row>
          </Container>
        );
      default:
        return <Xy {...chartType} data={data[chartType.id]} />;
    }
  };

  const manageXYSeries = (remove = false) => {
    setAllData((current) => {
      let newData: ChartsData = current;
      if (remove) {
        if (XYseriesCount[XYseriesType] > 1) {
          switch (XYseriesType) {
            case XYSeriesEnums.Column:
              newData = {
                ...current,
                xy: {
                  ...current.xy,
                  Column: current.xy.Column.map((series) => {
                    delete series[`value${XYseriesCount.Column}`];
                    return series;
                  }),
                },
              };
              break;
            default:
              //  Math.floor(Math.random() * (10 - min + 1)) + min
              newData = {
                ...current,
                xy: {
                  ...current.xy,
                  [XYseriesType]: current.xy[XYseriesType].slice(0, -1),
                },
              };
              break;
          }

          XYseriesCount[XYseriesType]--;
        }
      } else {
        XYseriesCount[XYseriesType]++;
        switch (XYseriesType) {
          case XYSeriesEnums.Column:
            newData = {
              ...current,
              xy: {
                ...current.xy,
                Column: allData.xy.Column.map(
                  (series) =>
                    (series = {
                      ...series,
                      [`value${XYseriesCount.Column}`]:
                        XYseriesCount.Column * 100,
                    })
                ),
              },
            };
            break;
          case XYSeriesEnums.Line:
            //  Math.floor(Math.random() * (10 - min + 1)) + min
            newData = {
              ...current,
              xy: {
                ...current.xy,
                Line: [
                  ...allData.xy.Line,
                  {
                    year: (
                      parseFloat(
                        String(
                          current.xy.Line[current.xy.Line.length - 1]["year"]
                        )
                      ) + 1
                    ).toString(),
                    europe: Math.floor(Math.random() * 10) + 1,
                    namerica: Math.floor(Math.random() * 7) + 1,
                    asia: Math.floor(Math.random() * 8) + 1,
                  },
                ],
              },
            };
            break;

          case XYSeriesEnums.Step:
            newData = {
              ...current,
              xy: {
                ...current.xy,
                Step: [
                  ...allData.xy.Step,
                  {
                    date: new Date(2021, 0, XYseriesCount.Step).getTime(),
                    value: Math.floor(Math.random() * 91) + 10,
                  },
                ],
              },
            };
            break;
        }
      }
      console.log(newData.xy[XYseriesType]);
      return newData;
    });
  };

  return (
    <>
      <h3 className="title text-info">{chartType.label}</h3>
      {renderSwitch(chartType.id)}
    </>
  );
};

export default ChartHome;
