export interface Shutdown {
    id: number;
    lineNo: number;
    machineNo: string;
    startTime: string; // ISO string or format YYYY-MM-DDTHH:mm
    stopTime: string;  // ISO string or format YYYY-MM-DDTHH:mm
    remarks: string;
}

// Initial dummy data for the current month
export const mockShutdowns: Shutdown[] = [
    {
        id: 1,
        lineNo: 1,
        machineNo: "M-101",
        startTime: "2026-04-15T08:00",
        stopTime: "2026-04-15T12:00",
        remarks: "Preventive Maintenance",
    },
    {
        id: 2,
        lineNo: 2,
        machineNo: "M-205",
        startTime: "2026-04-20T14:30",
        stopTime: "2026-04-20T16:45",
        remarks: "Sensor Replacement",
    },
    {
        id: 3,
        lineNo: 1,
        machineNo: "M-102",
        startTime: "2026-04-25T09:00",
        stopTime: "2026-04-25T11:30",
        remarks: "Calibration",
    }
];
