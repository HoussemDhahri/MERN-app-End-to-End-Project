const mongoose = require("mongoose");

module.exports = async () => {
    const useDBAuth = process.env.USE_DB_AUTH === "true";

    const connectionParams = {
        serverSelectionTimeoutMS: 5000,
    };

    if (useDBAuth) {
        connectionParams.user = process.env.MONGO_USERNAME;
        connectionParams.pass = process.env.MONGO_PASSWORD;
    }

    while (true) {
        try {
            await mongoose.connect(
                process.env.MONGO_CONN_STR,
                connectionParams
            );

            console.log("Connected to database.");
            break;
        } catch (error) {
            console.error(
                "Could not connect to database. Retrying in 5 seconds..."
            );
            console.error(error.message);

            await new Promise((resolve) => setTimeout(resolve, 5000));
        }
    }
};