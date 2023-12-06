import { connect } from 'mongoose';

export const dbConnect = () => {
    connect(process.env.MONGODB_ATLAS_URI).then(
        () => console.log("Database Connect Successfully"),
        (error) => console.log(error)
    );
};

// module.exports = { dbConnect };