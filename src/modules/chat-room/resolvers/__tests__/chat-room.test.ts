import "reflect-metadata";
import Container from "typedi";
import { ChatRoomModel, ChatroomResolver } from "../chat-room";

const mockChatRoomModel = {
  findBy: jest.fn(),
};
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
};

describe("ChatRoomResolver", () => {
  let resolver: ChatroomResolver;

  beforeEach(() => {
    Container.set(ChatRoomModel, mockChatRoomModel);
    Container.set("logger", mockLogger);
    resolver = Container.get(ChatroomResolver);
  });

  it("should be defined", () => {
    expect(resolver).toBeDefined();
  });

  it("should return user s rooms", async () => {
    const fakeUser = {
      sub: "123",
    };
    const fakeChatRoom = {
      id: "123",
      name: "test",
      description: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const fakeCtx = {
      user: {
        sub: "123",
      },
    };
    mockChatRoomModel.findBy.mockResolvedValueOnce([fakeChatRoom]);

    const result = await resolver.myRooms(fakeCtx);

    expect(mockChatRoomModel.findBy).toBeCalledWith(fakeUser.sub);
    expect(mockLogger.info).toBeCalledWith("Getting user's rooms");
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "123",
          name: "test",
        }),
      ])
    );
  });
});
