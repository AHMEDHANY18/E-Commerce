import mongoose from 'mongoose';

const connectiontDB = async () => {
    return await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connection');
        })
        .catch((err) => {
            console.log({ msg: 'Error: ', err });
        });
};

export default connectiontDB;
