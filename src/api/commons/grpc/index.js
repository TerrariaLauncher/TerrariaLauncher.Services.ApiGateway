export class GrpcError extends Error {
    constructor(error) {
        super(error.message);

        /**
         * @type {number}
         */
        this.code = error.code;

        /**
         * @type {string}
         */
        this.details = error.details;
        /**
         * @type {import('@grpc/grpc-js').Metadata}
         */
        this.metadata = error.metadata;

        /**
         * @type {string}
         */
        this.stack = error.stack;
    }
}
