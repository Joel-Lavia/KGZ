import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, InferSchemaType } from 'mongoose';
import { rolesUsers, sexeUsers } from 'src/core/enums/user.enum';

export type UserDocument = HydratedDocument<User>;

@Schema({
  versionKey: false,
  toJSON: {
    transform: (doc, ret: any) => {
      delete ret.password;
      delete ret.__v;
      ret.id = ret._id;
      delete ret._id;
      return ret;
    },
  },
})
export class User {
  @Prop()
  profilImage?: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ type: String, enum: Object.values(sexeUsers) })
  sexe?: sexeUsers;

  @Prop()
  email?: string;

  @Prop({ required: true, select: false })
  password!: string;

  @Prop({ required: true, unique: true })
  telephone!: string;

  @Prop({
    type: [String],
    enum: Object.values(rolesUsers),
    default: rolesUsers.USER,
  })
  role?: rolesUsers[];
}
export type UserDataResponse = InferSchemaType<typeof UsersChema>;
export type userPublicDataResponse = Omit<
  InferSchemaType<typeof UsersChema>,
  'password'
>;
export const UsersChema = SchemaFactory.createForClass(User);
