import { Ctx, Field, ObjectType, Query, Resolver } from "type-graphql";
import { Inject, Service } from "typedi";
import { ILogger } from "../../logger";
import { ChatRoom } from "../types/chat-room";
import { IContext } from "../types/context";

export class ActiveModel<M> {
  public findBy(userId: string): Promise<M[]> {
    throw new Error("Not implemented");
  }
}

@Service()
@ObjectType()
export class ChatRoomModel extends ActiveModel<ChatRoom> {
  @Field()
  id!: string;
  @Field()
  name!: string;
  @Field()
  description!: string;
  @Field()
  createdAt!: Date;
  @Field({ nullable: true })
  updatedAt?: Date;
}

@Service()
@Resolver(ChatRoomModel)
export class ChatroomResolver {
  constructor(
    private readonly chatroomModel: ChatRoomModel,
    @Inject("logger") private readonly logger: ILogger
  ) {}

  @Query(() => [ChatRoomModel], { nullable: true })
  async myRooms(@Ctx() ctx: IContext): Promise<ChatRoom[] | null> {
    try {
      this.logger.info("Getting user's rooms");
      const result = await this.chatroomModel.findBy(ctx.user.sub);

      return result;
    } catch (err) {
      this.logger.error(err);
      return null;
    }
  }
}
