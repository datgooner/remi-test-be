import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Model, Schema as MongooseSchema } from "mongoose";
import { User } from "../user/user.model";

type VideoModel = Model<HydratedDocument<Video>>;

@Schema({ timestamps: true })
export class Video {
  @Prop()
  url: string;

  @Prop()
  embedUrl: string;

  @Prop()
  videoId: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: "User" })
  createBy: User;
}

const VideoSchema = SchemaFactory.createForClass(Video);

export { VideoSchema, VideoModel };
