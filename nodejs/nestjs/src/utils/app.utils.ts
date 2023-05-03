import DateTimeUtils from "./date-time.utils";

export class AppUtils {

    static timeToString() {
        return DateTimeUtils.getTime().toString();
    }

    static milliTimeToQueueDelayTime(
        milli: number
    ): number {
        const time = DateTimeUtils.getTime();
        if(milli < time) {
            return 0;
        }
        return milli - time;
    }
}