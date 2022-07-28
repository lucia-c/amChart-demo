import React, { FC, useState } from 'react';
import { ChartProps } from '../App';
import Xy, { XYSeriesEnums } from "../components/xy-chart";
import './chart.module.scss';
import ChartButton from '../components/button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export type ChartsData = {
    xy: {
        xyCols: XYdata[];
        xyLines: XYdata[];
    }
}

export type XYdata = {
    [key: string]: number | string;
}

// Define data
let data: ChartsData =
{
    xy: {
        xyCols: [
            {
                category: "Research",
                value1: 1000,
                value2: 588,
                value3: 688
            },
            {
                category: "Marketing",
                value1: 1200,
                value2: 1800,
                value3: 688
            },
            {
                category: "Sales",
                value1: 850,
                value2: 1230,
                value3: 688
            },
            {
                category: "Store",
                value1: 850,
                value2: 1230,
                value3: 688
            }
        ],
        xyLines: [
            {
                "year": "2021",
                "europe": 5,
                "namerica": 2.5,
                "asia": 1
            }, {
                "year": "2022",
                "europe": 2.6,
                "namerica": 6.7,
                "asia": 2.2
            }, {
                "year": "2023",
                "europe": 4.8,
                "namerica": 1.9,
                "asia": 4.4
            }

        ]
    }
}

export type ChartHomeProps = {
    chartType: ChartProps;
};

let XYseries = 3;

const ChartHome: FC<ChartHomeProps> = ({ chartType }) => {
    let [allData, setData] = useState<ChartsData>(data);
    let XYSeries: XYSeriesEnums = XYSeriesEnums.Column;

    const renderSwitch = (param) => {
        console.log('render chart page')
        switch (param) {
            case 'xy':
                return (
                    <Container>
                        <Row><Col> <Xy {...chartType} data={allData[chartType.id]['xyCols']} />
                        </Col>
                            <Col sm={2}><ChartButton label="addSeries" variant="success" onClick={() => manageXYSeries()}></ChartButton><ChartButton label="removeSeries" variant="danger" disabled={XYseries < 2} onClick={() => manageXYSeries(true)}></ChartButton></Col>
                        </Row>
                    </Container>

                );
            case 'bubble':
                return 'Bubble on working';
            default:
                return <Xy {...chartType} data={data[chartType.id]} />;
        }
    }

    const manageXYSeries = (remove = false) => {

        setData((current) => {
            let newData: ChartsData = current;
            if (remove) {
                if (XYseries > 1) {
                    newData = {
                        ...current, xy: {
                            ...current.xy, xyCols: current.xy.xyCols.map(series => {
                                delete series[`value${XYseries}`];
                                return series
                            })
                        }
                    }
                    XYseries--
                }
            } else {
                XYseries++
                console.log(XYseries)
                newData = {
                    ...current, xy: {
                        ...current.xy, xyCols: allData.xy.xyCols.map(series => series = { ...series, [`value${XYseries}`]: XYseries * 100 })
                    }
                }
            }
            return newData;
        })
        // setXySeries((oldValue) => {
        //     const newValue = oldValue + 1;
        //     setData({...allData, xy: allData.xy.map(serie => serie = { ...serie, [`value${newValue}`]: newValue * 100 })});
        //     return newValue
        // });

    }

    return (
        <>
            <h3 className="title">{chartType.label}</h3>
            {renderSwitch(chartType.id)}
        </>
    );
};

export default ChartHome;
