import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongoConfig: MongooseModuleOptions = {
 //Url to connect to MongoDB
  uri: process.env.MONGO_URIL,
  //Create indexation automaticaly if true
  autoIndex:false,
  //Retry to connect to MongoDB if connection failed
  retryAttempts: 3,
  //Delay between each retry
  retryDelay: 3000,
};
