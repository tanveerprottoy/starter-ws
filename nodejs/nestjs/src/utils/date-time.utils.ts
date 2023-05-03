import moment from "moment";

export default class DateTimeUtils {

    static getTime() {
        return new Date().getTime();
    }

    static getISOString() {
        return new Date().toISOString();
    }

    static getDateString() {
        return new Date().toDateString();
    }

    static getUTCString() {
        return new Date().toUTCString();
    }

    static isSame(
        startDate: Date,
        endDate: Date,
        granularity: moment.unitOfTime.Diff,
    ): boolean {
        const start = moment(startDate).startOf(granularity);
        const end = moment(endDate).startOf(granularity);
        return start.isSame(
            end,
            granularity,
        );
    }
}