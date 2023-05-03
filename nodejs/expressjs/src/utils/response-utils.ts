import express from "express";

export class ResponseUtils {

    static buildData(
        data: any
    ): any {
        return {
            data: data
        };
    }

    static respond(
        code: number,
        payload: any,
        res: express.Response,
    ): express.Response {
        return res.status(code).send(payload);
    }
}