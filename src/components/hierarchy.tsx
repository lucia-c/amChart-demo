/* eslint-disable @typescript-eslint/no-unused-expressions */
import React, { FC, useId, useLayoutEffect, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

import * as am5hierarchy from "@amcharts/amcharts5/hierarchy";
import { circleItem, HierarchyDataSeries, XYdata } from "../utils/mock";
import ThemeSelect, { allThemes } from "./custom-theme";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Form } from "react-bootstrap";


export enum HierarchySeriesEnums {
    Packed = 'Packed'
}

const HierarchySeries: HierarchySeriesEnums[] = [
    HierarchySeriesEnums.Packed
]

export type HierarchyProps = {
    data: HierarchyDataSeries;
    changeXYSerie?: (XYSeriesEnums) => void
};


//export default function XyChart(props ){
const HierarchyChart: FC<HierarchyProps> = ({ data, changeXYSerie }) => {

    const chartId = useId();
    const [chartState, setChartState] = useState<number>(0);
    const [chartData, setChartData] = useState<XYdata[]>([]);
    const [amRoot, setAmRoot] = useState<am5.Root>();
    const [chartTheme, setChartTheme] = useState<am5.Theme | null>(null);

    //let chartRef = React.createRef<HTMLDivElement>(); 
    // let chartRef = useRef(null); 
    // const series1Ref = useRef(null);
    // const series2Ref = useRef(null);
    //const xAxisRef = useRef(null);

    useLayoutEffect(() => {
        setChartData(data[HierarchySeries[0]]);
        console.log('***rendering***', chartState);

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

        let container = root.container.children.push(
            am5.Container.new(root, {
                width: am5.percent(100),
                height: am5.percent(100),
                layout: root.verticalLayout
            })
        );

        let series = container.children.push(am5hierarchy.Pack.new(root, {
            //singleBranchOnly: false,
            //downDepth: 10,
            topDepth: 2,
            //initialDepth: 10,
            valueField: "value",
            categoryField: "name",
            childDataField: "children",
          }));

        series.circles.template.setAll({
            fillOpacity: 0.7,
            strokeWidth: 1,
            strokeOpacity: 1
        });
        series.circles.template.states.create("hover", {
                fillOpacity: 1,
                strokeOpacity: 0,
                strokeDasharray: 0,
                scale: 1.3
            });

        // Force directed
        // series.outerCircles.template.states.create("disabled", {
        //     fillOpacity: 0.5,
        //     strokeOpacity: 0,
        //     strokeDasharray: 0
        // });

        // series.outerCircles.template.states.create("hover", {
        //     fillOpacity: 1,
        //     strokeOpacity: 0,
        //     strokeDasharray: 0,
        //     scale: 1.3
        // });
        // series.links.template.setAll({
        //     strokeWidth: 0,
        //     strokeOpacity: 0
        // });


        series.nodes.template.setAll({
            draggable: true,
            toggleKey: "none",
        });

   
        series.circles.template.adapters.add("fill", function(fill, target: am5.Circle) {
            
            if(target && target.dataItem?.dataContext) {
                const item = target.dataItem?.dataContext as circleItem
                switch (item['type']) {
                        case "trend":
                            return am5.color("#d553d5");
                            case "team":
                                return am5.color("#00aeff");
                        default:
                            return am5.color("#4e00df");  
                }

            }

            return am5.color("#ff00ff");

            })


        
        const labeSettings: Partial<am5.ILabelSettings> = {
            fontSize:10,
            //fill: am5.color(0x550000),
            text: "{category}",
            oversizedBehavior: 'truncate',
            breakWords: true
          }

        series.labels.template.setAll(labeSettings);

        series.data.setAll(chartData);
        series.set("selectedDataItem", series.dataItems[0]);


        // Make stuff animate on load
        // https://www.amcharts.com/docs/v5/concepts/animations/
        series.appear();


        return () => {
            root.dispose();
            setChartState(1);
        }


    }, [chartData, chartTheme, chartId, chartState, data]);

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
                        {/* <ThemeSelect root={amRoot} handleChange={(event) => setChartTheme(event)}></ThemeSelect> */}
                    </Col> </Row>
            </Container>
        </>
    );
};

export default HierarchyChart;
