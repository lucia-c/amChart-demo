import React, { FC, useState } from 'react';
import { ChartProps } from '../App';
import Xy from "../components/xy-chart";
import './chart.module.scss';
import ChartButton from '../components/button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export type ChartsData = {
    xy: XYdata[];
}

export type XYdata = {
    category: string;
    [key: string]: number | string;
}

// Define data
let data: ChartsData =
{
    xy: [
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
    ]
}

export type ChartHomeProps = {
    chartType: ChartProps;
};

const ChartHome: FC<ChartHomeProps> = ({ chartType }) => {
    let [XYseries, setXySeries] = useState<number>(3);

    const renderSwitch = (param) => {
        switch (param) {
            case 'xy':
                return (
                    <Container>
                        <Row><Col> <Xy {...chartType} data={data[chartType.id]} />
                        </Col>
                            <Col sm={2}><ChartButton label="addSeries" variant="success" onClick={() => addXYSeries()}></ChartButton></Col>
                        </Row>
                    </Container>


                );
            case 'bubble':
                return 'Bubble on working';
            default:
                return <Xy {...chartType} data={data[chartType.id]} />;
        }
    }

    const addXYSeries = () => {
        setXySeries(XYseries + 1);

        data.xy = data.xy.map(serie => serie = { ...serie, [`value${XYseries}`]: XYseries * 100 });

        console.log(data.xy[0]);
    }

    return (
        <section>
            <h3 className="title">{chartType.label}</h3>
            {renderSwitch(chartType.id)}
        </section>
    );
};

export default ChartHome;
