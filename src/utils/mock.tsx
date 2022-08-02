// Define data
export type ChartsData = {
  xy: XYDataSeries;
  hierarchy: HierarchyDataSeries;
  pieAndSliced: PieSlicedDataSeries;
}

export type circleItem = {
  name: string;
  value: number;
  type?: string;
}

export type XYDataSeries = {
  Column: GenericData[];
  Line: GenericData[];
  Step: GenericData[];
}

export type HierarchyDataSeries = {
  Pack: HierarchyDataRoot[];
  ForceDirected: HierarchyDataRoot[];
}

export type HierarchyDataRoot = {
  name: string;
  value?: number;
  children?: HierarchyData[];
}

export type HierarchyData = {
  name: string;
  value?: number;
  type?: string;
}

export type GenericData = {
  [key: string]: number | string;
}

export type PieSlicedDataSeries = {
  pie: PieData[];
  sliced: SlicedData[];
};

export type PieData = {
  [key: string]: number | string;
};

export type SlicedData = {
  [key: string]: number | string;
};

const charts_data: ChartsData =
{
  xy: {
    Column: [
      {
        category: "Research",
        value1: 1000,
        value2: 588,
        value3: 700
      },
      {
        category: "Marketing",
        value1: 1200,
        value2: 1800,
        value3: 688
      },
      {
        category: "Sales",
        value1: 850,
        value2: 1230,
        value3: 100
      },
      {
        category: "Store",
        value1: 300,
        value2: 900,
        value3: 2000
      }
    ],
    Line: [
      {
        "year": "2021",
        "europe": 5,
        "namerica": 2.5,
        "asia": 1
      }, {
        "year": "2022",
        "europe": 2.6,
        "namerica": 6.7,
        "asia": 2.2
      }, {
        "year": "2023",
        "europe": 4.8,
        "namerica": 1.9,
        "asia": 4.4
      }

    ],
    Step: [{
      date: new Date(2021, 0, 1).getTime(),
      value: 1000
    }, {
      date: new Date(2021, 0, 2).getTime(),
      value: 800
    }, {
      date: new Date(2021, 0, 3).getTime(),
      value: 499
    }, {
      date: new Date(2021, 0, 4).getTime(),
      value: 1200
    }, {
      date: new Date(2021, 0, 5).getTime(),
      value: 740
    }]
  },
  hierarchy: {
    Pack: [{
      name: "Root",
      value: 0,
      children: [{
        name: "X-TEAM BGF World",
        type: "trend",
        value: 71
      }, {
        name: "X-TEAM BGF Future",
        type: "trend",
        value: 27
      }, {
        name: "X-TEAM BGF Tecnology",
        type: "trend",
        value: 67
      }, {
        name: "X-TEAM BGF Economy",
        type: "trend",
        value: 10
      }, {
        name: "X-TEAM BGF Research",
        type: "trend",
        value: 74
      }, {
        name: "X-TEAM BGF Global",
        type: "classic",
        value: 90
      }, {
        name: "X-TEAM BGF Income strategy",
        type: "classic",
        value: 47

      }, {
        name: "Team BlackRock",
        type: "team",
        value: 50
      }, {
        name: "Team reds",
        type: "team",
        value: 20
      }]
    }],
    ForceDirected: [{
      name: "Root",
      value: 0,
      children: [{
        name: "X-TEAM BGF World",
        type: "trend",
        value: 71
      }, {
        name: "X-TEAM BGF Future",
        type: "trend",
        value: 27
      }, {
        name: "X-TEAM BGF Tecnology",
        type: "trend",
        value: 67
      }, {
        name: "X-TEAM BGF Economy",
        type: "trend",
        value: 10
      }, {
        name: "X-TEAM BGF Research",
        type: "trend",
        value: 74
      }, {
        name: "X-TEAM BGF Global",
        type: "classic",
        value: 90
      }, {
        name: "X-TEAM BGF Income strategy",
        type: "classic",
        value: 47

      }, {
        name: "Team BlackRock",
        type: "team",
        value: 50
      }, {
        name: "Team reds",
        type: "team",
        value: 20
      }]
    }

    ]
  },
  pieAndSliced: {
    pie: [
      {
        label: "France",
        value: 100000,
      },
      {
        label: "Spain",
        value: 160000,
      },
      {
        label: "United Kingdom",
        value: 80000,
      },
    ],
    sliced: [
      {
        label: "France",
        value: 100000,
      },
      {
        label: "Spain",
        value: 160000,
      },
      {
        label: "United Kingdom",
        value: 80000,
      },
    ],
  }
}
export default charts_data;

