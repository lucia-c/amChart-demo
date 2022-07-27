/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC, useEffect, useId, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import am5themes_Spirited from "@amcharts/amcharts5/themes/Spirited";

import * as am5xy from "@amcharts/amcharts5/xy";
import { XYdata } from "../pages/chartHome";
import themes from "./custom-theme"

export type XYProps = {
    data: XYdata[];
};


//export default function XyChart(props ){
const XyChart: FC<XYProps> = ({ data }) => {

    const chartId = useId();
    let [chartState, setChart] = useState<number>(0);
    let [chartData, setData] = useState<XYdata[]>([]);

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

        const customTheme = am5.Theme.new(root);

        customTheme.rule("Label").setAll(themes.allianz);

        // Set themes
        // https://www.amcharts.com/docs/v5/concepts/themes/
        root.setThemes([am5themes_Animated.new(root), am5themes_Spirited.new(root), customTheme]);

        let chart = root.container.children.push(
            am5xy.XYChart.new(root, {
                panX: false,
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

        // Create series
        // let series1: am5xy.ColumnSeries = chart.series.push(
        //     am5xy.ColumnSeries.new(root, {
        //         name: "Series",
        //         xAxis: xAxis,
        //         yAxis: yAxis,
        //         valueYField: "value1",
        //         categoryXField: "category"
        //     })
        // );
        // series1.data.setAll(data);

        // let series2 = chart.series.push(
        //     am5xy.ColumnSeries.new(root, {
        //         name: "Series",
        //         xAxis: xAxis,
        //         yAxis: yAxis,
        //         valueYField: "value2",
        //         categoryXField: "category"
        //     })
        // );
        // series2.data.setAll(data);

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

        return () => {
            root.dispose();
            setChart(1);
        }


    }, [chartData, chartId, chartState, data]);


    // This code will only run when props.data changes
    useEffect(() => {
        console.log('change data');
        setData(data);


        //     // xAxisRef?['current']['data'].setAll(data);
        //         // series1Ref?.current?.data.setAll(data);
        //         // series2Ref?.current?.data.setAll(data);
    }, [data, chartData]);


    return (
        <>

            {/* <div ref={chartRef} id={chartId} style={{ width: "100%", height: "500px" }}></div> */}
            <div id={chartId} style={{ width: "100%", height: "500px" }}></div>
        </>
    );
};

export default XyChart;
