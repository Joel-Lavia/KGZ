import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { rolesUsers, sexeUsers } from 'src/core/enums/user.enum';

export type userDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  profilImage?: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  LastName!: string;

  @Prop({ type: String, enum: Object.values(sexeUsers) })
  sexe?: sexeUsers;

  @Prop()
  email?: string;

  @Prop({ required: true })
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
export const usersChema = SchemaFactory.createForClass(User);
