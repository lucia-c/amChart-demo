import React, { FC } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { faker } from '@faker-js/faker';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';


ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];


export const data = {
    labels,
    datasets: [
        {
            label: 'Dataset 1',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
        {
            label: 'Dataset 2',
            data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
        },
    ],
};

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top' as const,
        },
        title: {
            display: true,
            text: 'Chart.js Line Chart',
        },
    },
};

export type LineChartProps = {
    title?: any;
};

const LineChart: FC<LineChartProps> = ({ title }) => {

    return (
        
            <Container>
                <Row>
                    <Col>
                        <Line options={options} data={data} />;
                    </Col>
                </Row>
            </Container>

    );
};

export default LineChart;
