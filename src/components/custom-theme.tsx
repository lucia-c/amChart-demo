import * as am5 from "@amcharts/amcharts5";

export type chartThemes = {
    allianz: Partial<am5.ILabelSettings>;
}

const themes: chartThemes = {
    allianz: {
        fill: am5.color(0xFF0000),
        fontSize: "1em",   
        //fontVariant: "small-caps"
    }
}
export default themes;