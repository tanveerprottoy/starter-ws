export default class CoreUtils {

    static printStringify(object: any) {
        try {
            const str = JSON.stringify(object, null, 4); // (Optional) beautiful indented output.
            console.log('stringify ' + str);
            return str;
        }
        catch(e) { }
    }

    static stringifyToObject(object: any) {
        try {
            return JSON.parse(
                JSON.stringify(object)
            );
        }
        catch(e) {
            console.log(e);
            return undefined;
        }
    }

    static generateRandomNumber(length: number) {
        return Math.floor(Math.pow(10, length - 1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1));
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

    static getKeysFromObject(object: any): string[] {
        return Object.keys(object);
    }

    static hasKey(
        object: any,
        key: string
    ): boolean {
        try {
            return object.hasOwnProperty(
                key
            );
        }
        catch(e) {
            return false;
        }
    }

    static stringify(object: any) {
        try {
            return JSON.stringify(object);
        }
        catch(e) {
            return "";
        }
    }
}