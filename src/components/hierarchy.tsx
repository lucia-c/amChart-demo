/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC, useId, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5xy from "@amcharts/amcharts5/xy";
import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import { HierarchyDataSeries, XYdata } from "../utils/mock";
import ThemeSelect, { allThemes } from "./custom-theme";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from "react-bootstrap";


export enum HierarchySeriesEnums {
    Force = 'Force'
}

const HierarchySeries: HierarchySeriesEnums[] = [
    HierarchySeriesEnums.Force
]

export type HierarchyProps = {
    data: HierarchyDataSeries;
    changeXYSerie?: (XYSeriesEnums) => void
};


//export default function XyChart(props ){
const HierarchyChart: FC<HierarchyProps> = ({ data, changeXYSerie }) => {

    const chartId = useId();
    let [chartState, setChart] = useState<number>(0);
    let [chartData, setData] = useState<XYdata[]>([]);
    let [amRoot, setRoot] = useState<am5.Root>();
    let [chartTheme, setTheme] = useState<am5.Theme | null>(null);
    let [chartSeries, setSeries] = useState<HierarchySeriesEnums>(HierarchySeries[0]);

    //let chartRef = React.createRef<HTMLDivElement>(); 
    // let chartRef = useRef(null); 
    // const series1Ref = useRef(null);
    // const series2Ref = useRef(null);
    //const xAxisRef = useRef(null);

    useLayoutEffect(() => {
        setData(data[chartSeries]);
        console.log('***rendering***', chartState, chartSeries);

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

        let container = root.container.children.push(
            am5.Container.new(root, {
                width: am5.percent(100),
                height: am5.percent(100),
                layout: root.verticalLayout
            })
        );


        let series = container.children.push(
            am5hierarchy.ForceDirected.new(root, {
                centerStrength: 1,
                manyBodyStrength: 0.5,
                //downDepth: 1,
                //initialDepth: 3,
                topDepth: 2,
                valueField: "value",
                categoryField: "name",
                childDataField: "children",
                nodePadding: 0.1,
                //linkWithStrength: 20,
                minRadius: 20,
                maxRadius: am5.percent(15),
                // initialFrames: 100,
                // showOnFrame: 30,
                // velocityDecay:0.4
            })
        );

        series.circles.template.setAll({
            fillOpacity: 0.7,
            strokeWidth: 1,
            strokeOpacity: 1
        });


        series.outerCircles.template.states.create("disabled", {
            fillOpacity: 0.5,
            strokeOpacity: 0,
            strokeDasharray: 0
        });

        series.outerCircles.template.states.create("hover", {
            fillOpacity: 1,
            strokeOpacity: 0,
            strokeDasharray: 0,
            scale: 1.3
        });

        series.nodes.template.setAll({
            draggable: false
        });

        series.links.template.setAll({
            strokeWidth: 0,
            strokeOpacity: 0
        });

        series.labels.template.setAll({
            fontSize: 20,
            //fill: am5.color(0x550000),
            text: "{category}"
          });

        series.data.setAll(chartData);
        series.set("selectedDataItem", series.dataItems[0]);


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();


        return () => {
            root.dispose();
            setChart(1);
        }


    }, [chartData, chartTheme, chartId, chartState, data, chartSeries]);

    // const changeSeries = (newSerie) => {
    //     setSeries(newSerie);
    //     changeXYSerie && changeXYSerie(newSerie);
    // }


    return (
        <>
            <Container>
                {/* <Row>
                    <Col>
                        <Form.Select aria-label="XY series type" onChange={(event) => changeSeries(XYSeriesEnums[event.target.value])} value={chartSeries}>
                            <option>Select chart series</option>
                            {
                                XYSeries.map((serie) => {
                                    return <option value={serie} key={serie}> {serie} </option>
                                })}
                        </Form.Select>
                    </Col>
                </Row> */}
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

export default HierarchyChart;
