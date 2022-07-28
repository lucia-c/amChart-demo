/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC, useEffect, useId, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5xy from "@amcharts/amcharts5/xy";
import { XYdata } from "../pages/chartHome";
import ThemeSelect, { allThemes } from "./custom-theme";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from "react-bootstrap";


export enum XYSeriesEnums {
    Column = 'Column',
    Line = 'Line'
}

const XYSeries: XYSeriesEnums[] = [
    XYSeriesEnums.Column, XYSeriesEnums.Line
]

export type XYProps = {
    data: XYdata[];
};


//export default function XyChart(props ){
const XyChart: FC<XYProps> = ({ data }) => {

    const chartId = useId();
    let [chartState, setChart] = useState<number>(0);
    let [chartData, setData] = useState<XYdata[]>([]);
    let [amRoot, setRoot] = useState<am5.Root>();
    let [chartTheme, setTheme] = useState<am5.Theme | null>(null);
    let [series, setSeries] = useState<XYSeriesEnums>(XYSeriesEnums.Column);

    //let chartRef = React.createRef<HTMLDivElement>(); 
    // let chartRef = useRef(null); 
    // const series1Ref = useRef(null);
    // const series2Ref = useRef(null);
    //const xAxisRef = useRef(null);

    useLayoutEffect(() => {
        setData(data);
        console.log('***rendering***', chartState);

        //let root = am5.Root.new(chartRef.current as HTMLElement);       
        let root: am5.Root = am5.Root.new(chartId);
        setRoot(root);

        const customTheme = am5.Theme.new(root);

        customTheme.rule("Label").setAll(allThemes.allianz);

        // Set themes from select list
        // https://www.amcharts.com/docs/v5/concepts/themes/
        let actualThemes: am5.Theme[] = [am5themes_Animated.new(root), customTheme];
        if (chartTheme) {
            actualThemes = [...actualThemes, chartTheme];
        }
        root.setThemes(actualThemes);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: true,
                panY: false,
                wheelX: "panX",
                wheelY: "zoomX",
                layout: root.verticalLayout
            })
        );

        // Add legend
        // https://www.amcharts.com/docs/v5/charts/xy-chart/legend-xy-series/
        let legend = chart.children.push(
            am5.Legend.new(root, {
                centerX: am5.p50,
                x: am5.p50
            })
        );

        //legend.data.setAll(chart.series.values);

        // Create X-Axis
        let xAxis: am5xy.CategoryAxis<am5xy.AxisRenderer> = chart.xAxes.push(
            am5xy.CategoryAxis.new(root, {
                categoryField: "category",
                renderer: am5xy.AxisRendererX.new(root, {
                    cellStartLocation: 0.1,
                    cellEndLocation: 0.9
                }),
                tooltip: am5.Tooltip.new(root, {})
            })
        );
        xAxis.data.setAll(chartData);

        // Create Y-axis
        let yAxis: am5xy.ValueAxis<am5xy.AxisRenderer> = chart.yAxes.push(
            am5xy.ValueAxis.new(root, {
                renderer: am5xy.AxisRendererY.new(root, {})
            })
        );

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        // xAxisRef.current = xAxis;
        // series1Ref.current = series1;
        // series2Ref.current = series2;

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name: string) {
            console.log('makeSerie ' + name);
            let series = chart.series.push(am5xy.ColumnSeries.new(root, {
                name: name.toUpperCase(),
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: name,
                categoryXField: "category"
            }));

            series.columns.template.setAll({
                tooltipText: "{name}, {categoryX}:{valueY}",
                width: am5.percent(90),
                tooltipY: 0
            });

            series.data.setAll(chartData);

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 0,
                    sprite: am5.Label.new(root, {
                        text: "{valueY}",
                        fill: root.interfaceColors.get("alternativeText"),
                        centerY: 0,
                        centerX: am5.p50,
                        populateText: true
                    })
                });
            });

            legend.data.push(series);
        }

        if (chartState === 1) {
            Object.keys(chartData[0]).forEach((key) => {
                if (key !== 'category') {
                    makeSeries(key);
                }
            });

        }

        chart.appear(1000, 100);

        let legend1 = chart.children.push(am5.Legend.new(root, {

            nameField: "name",
            fillField: "color",
            strokeField: "color",
            centerX: am5.percent(50),
            x: am5.percent(50)
        }));

        legend1.data.setAll([{
            name: "Under budget",
            color: am5.color(0x297373)
        }, {
            name: "Over budget",
            color: am5.color(0xff621f)
        }]);

        return () => {
            root.dispose();
            setChart(1);
        }


    }, [chartData, chartTheme, chartId, chartState, data, series]);

    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form.Select aria-label="XY series type" onChange={(event) => setSeries(XYSeriesEnums[event.target.value])}>
                            <option>Select chart theme</option>
                            {
                                XYSeries.map((serie) => {
                                    return <option value={serie} key={serie}> {serie} </option>
                                })}
                        </Form.Select>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        {/* <div ref={chartRef} id={chartId} style={{ width: "100%", height: "500px" }}></div> */}
                        <div id={chartId} style={{ width: "100%", height: "500px" }}></div>
                        <ThemeSelect root={amRoot} handleChange={(event) => setTheme(event)}></ThemeSelect>
                    </Col> </Row>
            </Container>
        </>
    );
};

export default XyChart;
