import React, { FC, useState } from "react";
import * as am5 from "@amcharts/amcharts5";
import am5themes_Spirited from "@amcharts/amcharts5/themes/Spirited";
import am5themes_Dark from "@amcharts/amcharts5/themes/Dark";
import am5themes_Dataviz from "@amcharts/amcharts5/themes/Dataviz";
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
    amThemes: [ {name: 'Dark', theme: am5themes_Dark}, {name: 'Dataviz', theme: am5themes_Dataviz}, {name: 'Spirited', theme: am5themes_Spirited} //'Frozen', 'Kelly', 'Material', 'Micro', 'Moonrise', 'Responsive', 
    ],
    allianz: {
        fill: am5.color(0xFF0000),
        fontSize: "1em",   
        //fontVariant: "small-caps"
    }
}

type ThemeProps = {
    root?: am5.Root, 
    themes?: chartThemesProps, 
    handleChange?: (theme:am5.Theme) => void
}


const ThemeSelect: FC<ThemeProps> = ({root, handleChange}) => {
    let [chartTheme, setTheme] = useState<am5.Theme>();
    let [themesList] = useState<chartThemesProps>(allThemes);
    const [value, setValue] = useState();

    const updateValue  =  ({ target }) => {
        const newTheme = themesList.amThemes.find(theme => theme.name === target.value)?.theme
        setTheme(newTheme?.new(root));
        setValue(target.value); 
        if (chartTheme && handleChange) {
            handleChange(chartTheme);
        }
        console.log('change theme inside select', chartTheme)
    };

    return (
        <Container>
        <Row className="justify-content-center"><Col sm={6}>
            <Form.Select aria-label="Theme selection" value={value} onChange={(target) => updateValue(target)}>
                <option>Open this select menu</option>
                {
                    themesList.amThemes.map((amtheme) => {
                        return <option value={amtheme.name} key={amtheme.name}> {amtheme.name} </option>
                    })}
            </Form.Select>

        </Col></Row></Container>
    );
 };

export default ThemeSelect;
