// dummy-schedule.ts
export const scheduleBlocks = [
    {
        id: "line-1",
        title: "PC-RADIAL LINE 1",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 10,
                code: "4345",
                qty: 750,
                start: 8,
                end: 19,
                remark: "",
                phases: [
                    { type: "building", start: 8, end: 10 },
                    { type: "curing", start: 10, end: 13 },
                    { type: "idle", start: 13, end: 14 },
                    { type: "curing", start: 14, end: 18 },
                    { type: "buffer", start: 18, end: 19 },
                ],
            },
            {
                mc: 20,
                code: "4346",
                qty: 750,
                start: 9,
                end: 18,
                remark: "",
                phases: [
                    { type: "building", start: 9, end: 11 },
                    { type: "curing", start: 11, end: 14 },
                    { type: "idle", start: 14, end: 15 },
                    { type: "curing", start: 15, end: 17 },
                    { type: "buffer", start: 17, end: 18 },
                ],
            },
        ],
    },

    {
        id: "line-2",
        title: "PC-RADIAL LINE 2",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 11,
                code: "4345",
                qty: 750,
                start: 8,
                end: 17,
                remark: "",
                phases: [
                    { type: "building", start: 8, end: 10 },
                    { type: "curing", start: 10, end: 12 },
                    { type: "idle", start: 12, end: 13 },
                    { type: "curing", start: 13, end: 16 },
                    { type: "buffer", start: 16, end: 17 },
                ],
            },
            {
                mc: 21,
                code: "4617",
                qty: 750,
                start: 9,
                end: 19,
                remark: "",
                phases: [
                    { type: "building", start: 9, end: 11 },
                    { type: "curing", start: 11, end: 14 },
                    { type: "idle", start: 14, end: 15 },
                    { type: "curing", start: 15, end: 18 },
                    { type: "buffer", start: 18, end: 19 },
                ],
            },
            {
                mc: 48,
                code: "4742",
                qty: 750,
                start: 8,
                end: 16,
                remark: "",
                phases: [
                    { type: "building", start: 8, end: 9.5 },
                    { type: "curing", start: 9.5, end: 12 },
                    { type: "idle", start: 12, end: 13 },
                    { type: "curing", start: 13, end: 15 },
                    { type: "buffer", start: 15, end: 16 },
                ],
            },
        ],
    },

    {
        id: "line-3",
        title: "PC-RADIAL LINE 3",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 12,
                code: "4392",
                qty: 750,
                start: 9,
                end: 18,
                remark: "",
                phases: [
                    { type: "building", start: 9, end: 11 },
                    { type: "curing", start: 11, end: 14 },
                    { type: "idle", start: 14, end: 15 },
                    { type: "curing", start: 15, end: 17 },
                    { type: "buffer", start: 17, end: 18 },
                ],
            },
        ],
    },

    {
        id: "line-4",
        title: "PC-RADIAL LINE 4",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 13,
                code: "4667",
                qty: 750,
                start: 8,
                end: 17,
                remark: "",
                phases: [
                    { type: "building", start: 8, end: 10 },
                    { type: "curing", start: 10, end: 13 },
                    { type: "idle", start: 13, end: 14 },
                    { type: "curing", start: 14, end: 16 },
                    { type: "buffer", start: 16, end: 17 },
                ],
            },
        ],
    },

    {
        id: "line-5",
        title: "PC-RADIAL LINE 5",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 14,
                code: "4528",
                qty: 750,
                start: 9,
                end: 15,
                remark: "BESOK SHUTDOWN",
                phases: [
                    { type: "building", start: 9, end: 10.5 },
                    { type: "curing", start: 10.5, end: 13 },
                    { type: "idle", start: 13, end: 14 },
                    { type: "buffer", start: 14, end: 15 },
                ],
            },
        ],
    },

    {
        id: "line-6",
        title: "PC-RADIAL LINE 6",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 15,
                code: "4345",
                qty: 750,
                start: 8,
                end: 18,
                remark: "",
                phases: [
                    { type: "building", start: 8, end: 11 },
                    { type: "curing", start: 11, end: 14 },
                    { type: "idle", start: 14, end: 15 },
                    { type: "curing", start: 15, end: 17 },
                    { type: "buffer", start: 17, end: 18 },
                ],
            },
        ],
    },

    {
        id: "line-7",
        title: "PC-RADIAL LINE 7",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 16,
                code: "4322",
                qty: 750,
                start: 9,
                end: 19,
                remark: "",
                phases: [
                    { type: "building", start: 9, end: 11 },
                    { type: "curing", start: 11, end: 15 },
                    { type: "idle", start: 15, end: 16 },
                    { type: "curing", start: 16, end: 18 },
                    { type: "buffer", start: 18, end: 19 },
                ],
            },
        ],
    },

    {
        id: "line-8",
        title: "PC-RADIAL LINE 8",
        shift: "08:00 - 16:00",
        rows: [
            {
                mc: 17,
                code: "4466",
                qty: 750,
                start: 8,
                end: 16,
                remark: "",
                phases: [
                    { type: "building", start: 8, end: 9.5 },
                    { type: "curing", start: 9.5, end: 12 },
                    { type: "idle", start: 12, end: 13 },
                    { type: "curing", start: 13, end: 15 },
                    { type: "buffer", start: 15, end: 16 },
                ],
            },
        ],
    },
];
