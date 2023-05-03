export default class StringUtils {

    static testRegex(
        pattern: string,
        value: string,
    ): boolean {
        try {
            const regex = new RegExp(
                pattern
            );
            return regex.test(
                value
            );
        }
        catch (e) {
            return false;
        }
    }

    static split(
        src: string,
        separator: string | RegExp,
        limit?: number
    ) {
        return src.split(
            separator,
            limit
        );
    }

    static generateRandomString(
        length: number
    ) {
        return Array(length + 1)
            .join(
                (Math.random()
                    // Convert  to base-36
                    .toString(36) + '00000000000000000').slice(2, length)
            ).slice(0, length)
    }

    static trim(
        value: string
    ): string {
        try {
            return value.trim();
        }
        catch(e) {
            return value;
        }
    }

    static trimAndToUpperCase(
        value: string
    ): string {
        try {
            return value.trim().toUpperCase();
        }
        catch (e) {
            return "";
        }
    }

}