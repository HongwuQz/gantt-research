import { FC, useState } from 'react';
import { Bar } from '@ant-design/plots';
import { BarConfig, Datum } from '@ant-design/charts';
import dayjs from 'dayjs';

export const AntdGanttComponent: FC = () => {
  const data = [
    {
      EOMS: {dueDate: "2024-10-31 00:00:00", status: "normal"},
      EOFS: {dueDate: '2023-07-31 00:00:00'},
      GA: {dueDate: "2022-10-31 00:00:00"},
      type: "LTS",
      version: "3.10",
    },
    {
        EOMS: {dueDate: "2024-04-30 00:00:00", status: "normal"},
        EOFS: {dueDate: '2023-01-31 00:00:00'},
        GA: {dueDate: "2022-04-30 00:00:00"},
        type: "LTS",
        version: "3.8",
    },
    {
        EOMS: {dueDate: "2023-10-31 00:00:00", status: "normal"},
        EOFS: {dueDate: '2022-07-31 00:00:00'},
        GA: {dueDate: "2021-10-31 00:00:00"},
        type: "LTS",
        version: "3.6",
    },
    {
        EOMS: {dueDate: "2023-04-30 00:00:00", status: "normal"},
        EOFS: {dueDate: '2022-01-31 00:00:00'},
        GA: {dueDate: "2021-04-30 00:00:00"},
        type: "LTS",
        version: "3.4",
    },
    {
        EOMS: {dueDate: "2022-10-31 00:00:00", status: "normal"},
        EOFS: {dueDate: '2021-07-31 00:00:00'},
        GA: {dueDate: "2020-10-31 00:00:00"},
        type: "LTS",
        version: "3.0",
    },
  ];

  interface formateLifeCycle {
    version: string,
    full?: [string, string], // GA > EOFS
    maintenance?: [string, string],  // EOFS > EOMS
    // duration: Duration,
    duration: StringDuration,
    status: LifeStatus
  }

  type LifeStatus = 'full' | 'maintenance'
//   type Duration = [number, number]
  type StringDuration = [string, string]

  const currentPosition = new Date().getTime()

  const [minStamp, setMinStamp] = useState<number>(currentPosition)
  const [maxStamp, setMaxStamp] = useState<number>(currentPosition)

  const showMonth = false;

  const handleData = data.reduce((pre, cur) => {
    // const parseDate = (time: string) => Date.parse(time)
    // const reformateItemFull = {
    //     version: cur.version,
    //     duration: [parseDate(cur.GA.dueDate), parseDate(cur.EOFS.dueDate)] as Duration,
    //     status: 'full' as LifeStatus
    // }
    // const reformateItemMaintenance = {
    //     version: cur.version,
    //     duration: [parseDate(cur.EOFS.dueDate), parseDate(cur.EOMS.dueDate)] as Duration,
    //     status: 'maintenance' as LifeStatus
    // }

    const reformateItemFull = {
        version: cur.version,
        duration: [cur.GA.dueDate, cur.EOFS.dueDate] as StringDuration,
        status: 'full' as LifeStatus
    }
    const reformateItemMaintenance = {
        version: cur.version,
        duration: [cur.EOFS.dueDate, cur.EOMS.dueDate] as StringDuration,
        status: 'maintenance' as LifeStatus
    }
    const curGAStamp = Date.parse(cur.GA.dueDate)
    const curEOMSStamp = Date.parse(cur.EOMS.dueDate)
    curGAStamp < minStamp && setMinStamp(curGAStamp)
    curEOMSStamp > maxStamp && setMaxStamp(curEOMSStamp)
    // console.log({ GA: cur.GA, EOMS: cur.EOMS, EOFS: cur.EOFS })
    // console.log({reformateItemFull, reformateItemMaintenance})
    return [...pre, reformateItemFull, reformateItemMaintenance]
  }, [] as formateLifeCycle[])

  const config: BarConfig = {
    data: handleData,
    xField: 'duration',
    yField: 'version',
    autoFit: true,
    renderer: 'svg',
    padding: 60,
    seriesField: 'status',
    legend: {
        layout: 'horizontal',
        position: 'bottom'
    },
    tooltip: {
        formatter: (datum: Datum) => ({
            name: datum.status, value: datum.duration.map((item: string) => dayjs(item).format('YYYY-MM')).join('-')
        }),
    },
    annotations: [{
        type: 'line',
        start: ['start', currentPosition],
        end: ['end', currentPosition],
        text: {
            content: '当前日期',
            position: 'right',
            offsetY: -6,
            offsetX: 6,
            autoRotate: false,
            style: {
              textAlign: 'left',
            },
          },
    }],
    xAxis: {
        type: 'time',
        min: minStamp - 2592000000,
        max: maxStamp + 2592000000,
        // max: new Date().getTime(),
        mask: showMonth ? 'YYYY-MM' : 'YYYY',
        tickMethod: 'time',
        tickInterval: showMonth ? 2592000000 : 31536000000,
        label: {
            autoRotate: true
        }
    },
    limitInPlot: true,
    color: ({ status }) => {
        if(status === 'maintenance') {
            return '#ffb82c'
        }
        return '#00ae3b'
    },
  };
  return (<div>
      <Bar {...config} />
  </div>);
};
