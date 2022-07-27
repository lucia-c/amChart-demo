import React, { useState } from 'react';
import Button from './components/button';
import ChartHome from "./pages/chartHome";
import './App.scss';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export type ChartProps = {
  id: string;
  label: string;
}


const charts: ChartProps[] = [
  {
    id: 'xy',
    label: "XY chart"
  },
  {
    id: 'bubble',
    label: "Bubble chart"
  }
];

function App() {

  let [chartType, setChart] = useState<ChartProps>(charts[0]);

  const changeChart = (id) => {
    const selected = charts.find((chart: ChartProps) => chart.id === id)
    if (!!selected) {
      setChart(selected);
    }
    console.log('chart selected ', chartType);
  }

  return (
    <div className="App">
      <h2 className="titolo">Charts Demo</h2>
      <section className="container text-center my-3">
        <ChartHome chartType={chartType} />
      </section>
      <Container>
        <Row>

          {
            charts.map((chart, index) => {
              const { id } = chart; //destrutturazione
              return <Col key={id}> <Button {...chart} disabled={chartType.id === chart.id} onClick={() => changeChart(chart.id)}></Button></Col>
            })}

        </Row>
      </Container>
    </div>
  )
}


export default App;

