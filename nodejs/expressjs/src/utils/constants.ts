export const GlobalValues = {
    PORT: 8080,
    API: "/api",
    V1: "/v1",
    DB_HOST: "mongodb://localhost:27017",
    DB_USER: "root",
    DB_PASS: "root",
    DB_NAME: "starterExpressDb",
    UPDATE_FAILED: "Update failed",
    GENERIC_ERROR: "An error occurred",
    NOT_FOUND: "Not found",
    BAD_REQ: "Bad request",
} as const;

export const HttpCodes = {
    HTTP_200: 200,
    HTTP_201: 201,
    HTTP_400: 400,
    HTTP_404: 404,
} as const;