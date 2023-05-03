export default class JsonUtils {

    static parse(data: any): any {
        try {
            return JSON.parse(data);
        }
        catch(e) {
            console.error(e);
            return undefined;
        }
    }

    static stringifyToObject(object: any): any {
        try {
            return JSON.parse(
                JSON.stringify(object)
            );
        }
        catch(e) {
            console.error(e);
            return undefined;
        }
    }
}