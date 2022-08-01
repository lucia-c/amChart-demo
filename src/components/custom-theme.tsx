import React, { FC } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Dataviz from "@amcharts/amcharts5/themes/Dataviz";
import am5themes_Frozen from "@amcharts/amcharts5/themes/Frozen";
import am5themes_Kelly from "@amcharts/amcharts5/themes/Kelly";
import am5themes_Material from "@amcharts/amcharts5/themes/Material";
import am5themes_Micro from "@amcharts/amcharts5/themes/Micro";
import am5themes_Moonrise from "@amcharts/amcharts5/themes/Moonrise";
import am5themes_Responsive from "@amcharts/amcharts5/themes/Responsive";
import am5themes_Spirited from "@amcharts/amcharts5/themes/Spirited";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

export type chartThemesProps = {
    allianz: Partial<am5.ILabelSettings>;
    amThemes: Array<{
        name: string;
        theme: any;
    }>
}

export const allThemes: chartThemesProps = {
    amThemes: [
        { name: 'Dark', theme: am5themes_Dark },
        { name: 'Dataviz', theme: am5themes_Dataviz },
        { name: 'Frozen', theme: am5themes_Frozen },
        { name: 'Kelly', theme: am5themes_Kelly },
        { name: 'Material', theme: am5themes_Material },
        { name: 'Micro', theme: am5themes_Micro },
        { name: 'Moonrise', theme: am5themes_Moonrise },
        { name: 'Responsive', theme: am5themes_Responsive },
        { name: 'Spirited', theme: am5themes_Spirited }
    ],
    allianz: {
        //fill: am5.color(0xFF0000),
        fontSize: "1em",
        //fontVariant: "small-caps"
    }
}

type ThemeProps = {
    root?: am5.Root,
    themes?: chartThemesProps,
    handleChange?: (theme: am5.Theme | null) => void
}


const ThemeSelect: FC<ThemeProps> = ({ root, handleChange }) => {

    const updateValue = ({ target }) => {
        const newTheme: am5.Theme = allThemes.amThemes.find(theme => theme.name === target.value)?.theme?.new(root);
        handleChange && handleChange(newTheme || null);
        console.log('change theme inside select', newTheme)
    };

    return (
        <Container>
            <Row className="justify-content-center"><Col sm={6}>
                <Form.Select aria-label="Theme selection" onChange={(target) => updateValue(target)}>
                    <option>Select chart theme</option>
                    {
                        allThemes.amThemes.map((amtheme) => {
                            return <option value={amtheme.name} key={amtheme.name}> {amtheme.name} </option>
                        })}
                </Form.Select>

            </Col></Row></Container>
    );
};

export default ThemeSelect;
