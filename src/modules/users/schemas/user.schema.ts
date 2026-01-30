import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type userDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  profilImage: string;
  @Prop({ reauired: true })
  name: string;
  @Prop({ required: true })
  firstName: string;
  @Prop()
  LastName: string;
  @Prop()
  sexe: String;
  @Prop()
  email: string;
  @Prop({ required: true })
  password: string;
  @Prop({ required: true, unique: true })
  telephone: string;
  @Prop()
  role: string;
}
export const usersChema = SchemaFactory.createForClass(User);