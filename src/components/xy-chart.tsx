/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC,  useId, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5xy from "@amcharts/amcharts5/xy";
import { GenericData, XYDataSeries } from "../utils/mock";
import ThemeSelect, { allThemes } from "./custom-theme";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from "react-bootstrap";
import ChartCreation, { AxisDataTypes, ChartCategories } from "../common/hooks/chart.hook"


export enum XYSeriesEnums {
    Column = 'Column',
    Line = 'Line',
    Step = 'Step'
}

const XYSeries: XYSeriesEnums[] = [
    XYSeriesEnums.Column, XYSeriesEnums.Line, XYSeriesEnums.Step
]

export type XYProps = {
    data: XYDataSeries;
    changeXYSerie?: (XYSeriesEnums) => void
};


//export default function XyChart(props ){
const XyChart: FC<XYProps> = ({ data, changeXYSerie }) => {

    const chartId = useId();
    const [chartState, setChartState] = useState<number>(0);
    const [chartData, setChartData] = useState<GenericData[]>([]);
    const [amRoot, setAmRoot] = useState<am5.Root>();
    const [chartTheme, setChartTheme] = useState<am5.Theme | null>(null);
    const [chartSeries, setChartSeries] = useState<XYSeriesEnums>(XYSeriesEnums.Column);
    const { initChart, initLegend, initPrimaryKey, generateLabel, generateXAxe, generateYAxe} = ChartCreation();

    
    useLayoutEffect(() => {
        setChartData(data[chartSeries]);
        console.log('***rendering***', chartData, chartSeries);
        
        //let root = am5.Root.new(chartRef.current as HTMLElement);       
        let root: am5.Root = am5.Root.new(chartId);    
        setAmRoot(root);

        const customTheme = am5.Theme.new(root);

        customTheme.rule("Label").setAll(allThemes.allianz);

        // Set themes from select list
        // https://www.amcharts.com/docs/v5/concepts/themes/
        let actualThemes: am5.Theme[] = [am5themes_Animated.new(root), customTheme];
        if (chartTheme) {
            actualThemes = [...actualThemes, chartTheme];
        }
        root.setThemes(actualThemes);    

        let chart = initChart(root, ChartCategories.xy);
        let primaryKey = initPrimaryKey(chartSeries);
        let legend = chart.children.push(initLegend(root));

        // Create X-Axis
        let xAxis: am5xy.CategoryAxis<am5xy.AxisRenderer> | am5xy.DateAxis<am5xy.AxisRenderer>;
        switch (chartSeries) {
            case XYSeriesEnums.Step:
                xAxis = generateXAxe(root, chart, primaryKey, AxisDataTypes.date);
                break;
            default:
                xAxis = generateXAxe(root, chart, primaryKey);
                break;
        }

        //legend.data.setAll(chart.series.values); settiamo i dato insieme alle serie

        xAxis.data.setAll(chartData);

        // Create Y-axis
        let yAxis = generateYAxe(root, chart);

        // Add cursor
        chart.set("cursor", am5xy.XYCursor.new(root, {}));

        if (chartState === 1) {
            Object.keys(chartData[0]).forEach((key) => {
                if (key !== primaryKey) {
                    if (chartSeries === XYSeriesEnums.Step) {
                        makeSeries("Series with breaks", key);
                    } else {
                        makeSeries(key);
                    }
                }
            });

        }

        // xAxisRef.current = xAxis;
        // series1Ref.current = series1;
        // series2Ref.current = series2;

        // Add series
        // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
        function makeSeries(name: string, field?: string) {
            console.log('makeSerie ' + name);
            const seriesOptions = {
                name: name.toUpperCase(),
                xAxis: xAxis,
                yAxis: yAxis,
                valueYField: field || name,
                categoryXField: primaryKey
            }

            let series;
            switch (chartSeries) {
                case XYSeriesEnums.Column:
                    series = chart.series.push(am5xy.ColumnSeries.new(root, seriesOptions));
                    series.columns.template.setAll({
                        tooltipText: "{name}, {categoryX}:{valueY}",
                        width: am5.percent(90),
                        tooltipY: 0
                    });
                    break;
                case XYSeriesEnums.Line:
                    series = chart.series.push(am5xy.LineSeries.new(root, { ...seriesOptions, stacked: true }));
                    series.strokes.template.setAll({
                        strokeWidth: 3,
                        strokeDasharray: [10, 5]
                    });
                    series.fills.template.setAll({
                        fillOpacity: 0.5,
                        visible: true
                    });
                    break;
                case XYSeriesEnums.Step:
                    series = chart.series.push(am5xy.StepLineSeries.new(root, { ...seriesOptions, 
                        valueXField: primaryKey,
                        noRisers: true }));
                    series.strokes.template.setAll({
                        fillOpacity: 0.5,
                        visible: true
                    });
                    series.fills.template.setAll({
                        fillOpacity: 0.5,
                        visible: true
                    });
                    break;
            }


            series.data.setAll(chartData);

            series.bullets.push(function () {
                return am5.Bullet.new(root, {
                    locationY: 0,
                    sprite: am5.Label.new(root,
                        generateLabel({
                            text: "{valueY}",
                            fill: root.interfaceColors.get("alternativeText"),
                            centerY: 0,
                            centerX: am5.p50
                        })
                        )
                });
            });

            // Make stuff animate on load
            // https://www.amcharts.com/docs/v5/concepts/animations/
            series.appear();


            legend.data.push(series);
        }

        chart.appear(1000, 100);

        return () => {
            root.dispose();
            setChartState(1);
        }


    }, [chartTheme, chartId, chartState, data, chartSeries, chartData]);

    const changeSeries = (newSerie) => {
        console.log('CHANGE xy serie', newSerie)
        setChartSeries(newSerie);
        setChartData(data[newSerie]);
        changeXYSerie && changeXYSerie(newSerie);
    }


    return (
        <>
            <Container>
                <Row>
                    <Col>
                        <Form.Select aria-label="XY series type" onChange={(event) => changeSeries(XYSeriesEnums[event.target.value])} value={chartSeries}>
                            <option>Select chart series</option>
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
                        <ThemeSelect root={amRoot} handleChange={(event) => setChartTheme(event)}></ThemeSelect>
                    </Col> </Row>
            </Container>
        </>
    );
};

export default XyChart;
