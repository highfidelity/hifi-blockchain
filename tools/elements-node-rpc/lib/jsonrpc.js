
class Client {
    get options() {
        return this.mOptions;
    }

    constructor(opts) {
        this.mOptions = opts || {};
        this.mHttpClient = this.options.ssl ? require("https") : require("http");
    }

    call(method, params, path) {
        const host = this.options.host || "localhost";

        // construct the request payload
        const requestData = JSON.stringify({
            jsonrpc: "1.0",
            id: Date.now(),
            method: method,
            params: params || null
        });

        // construct the options for the http request
        var requestOptions = {
            hostname: host,
            port: this.options.port || 8332,
            method: this.options.method || "POST",
            path: path || "/",
            timeout: this.options.timeout || 30000,
            agent: false,
            rejectUnauthorized: this.options.ssl && this.options.sslStrict !== false,
            headers: {
                "Host": host,
                "Content-Type": "text/plain",
                "Content-Length": Buffer.byteLength(requestData)
            }
        };

        if (this.options.ssl && this.options.sslCa) {
            requestOptions.ca = this.options.sslCa;
        }

        if (this.options.user && this.options.password) {
            requestOptions.auth = this.options.user + ":" + this.options.password;
        }

        // send the request and wrap in a promise
        return new Promise((resolve, reject) => {
            const request = this.mHttpClient.request(requestOptions);

            request.on("response", (response) => {
                const buffer = [];

                response.on("data", (chunk) => buffer.push(chunk));
                response.on("end", () => {
                    var responseData = buffer.join("");

                    try {
                        responseData = JSON.parse(responseData);
                    }
                    catch (e) {
                        reject(new Error(`Unable to parse the JSON response. ${e.message}`));
                    }

                    if (responseData.hasOwnProperty("error") && responseData.error != null) {
                        reject(new Error(responseData.error.message || "Unknown server error"));
                    }
                    else if (!responseData.hasOwnProperty("result")) {
                        if (response.statusCode !== 200) {
                            reject(new Error(`Server Error. Status Code: ${response.statusCode}`));
                        }

                        reject(new Error("The JSON response is invalid."));
                    }
                    else {
                        resolve(responseData.result, response.headers);
                    }
                });
            });

            request.on("error", (err) => reject(err));
            request.end(requestData);
        });
    }
}

module.exports.Client = Client