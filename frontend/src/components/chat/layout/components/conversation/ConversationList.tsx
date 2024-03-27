import Image from "next/image";
import { memo, useEffect } from "react";
import { Button } from "@anesok/components/ui/button";
import { api } from "@anesok/utils/api";
import Loading from "@anesok/components/ui/loading";
import ConversationCard from "./ConversationCard";
import IllustrationContainer from "@anesok/components/general/IllustrationContainer";
import ConversationSkeleton from "./ConversationSkeleton";
import ProfileDropdown from "../ProfileDropdown";
import { useRouter } from "next/router";
import { useConversationStore } from "zustandStore/conversationStore";

const ConversationList = ({ userId }: { userId: string }) => {
  const ContentText = {
    title: "دردشة جديدة",
    noConversationDesc: "سلام !  لم تقم ببدء أي محادثة بعد. ابدأ رحلتك الآن",
  };

  const { push } = useRouter();
  const { conversationList, add, extend, isEmpty, getNewestConversationDate } =
    useConversationStore();

  const { data, isSuccess } = api.conversation.oneUser.useQuery(
    {
      userId: userId,
      page: 1,
      range: 50,
      createdAt: getNewestConversationDate(),
    },
    { enabled: !!userId }
  );

  const { mutate, isLoading } = api.conversation.create.useMutation({
    onSuccess(data) {
      add(data.conversation);
      push(`/chat/${data.conversation.id}`);
    },
  });

  useEffect(() => {
    if (isSuccess && data) {
      const newestConversationDate = getNewestConversationDate();
      if (!!newestConversationDate) {
        const newConversations = data.conversationList.filter(
          (conversation) => conversation.createdAt > newestConversationDate
        );
        extend(newConversations);
      } else {
        extend(data.conversationList);
      }
    }
  }, [isSuccess, data, extend]);

  return (
    <div className="w-full max-w-sm p-3">
      <section className="flex h-[6%] gap-x-2">
        <Image width={40} height={58} src={`/icons/logo.svg`} alt="logo" />
        <Button
          onClick={() => mutate({ userId: userId ?? "" })}
          disabled={isLoading}
          variant={"ghost"}
          className="text-[#DFC590]"
        >
          {isLoading ? <Loading withText={true} /> : ContentText.title}
        </Button>
      </section>
      <section className="h-[88%] overflow-hidden overflow-y-auto">
        {conversationList.length == 0 && isLoading && (
          <div className=" space-y-2">
            {Array.from({ length: 12 }).map((_, i) => (
              <ConversationSkeleton key={i} />
            ))}
          </div>
        )}
        {conversationList.length > 0 &&
          conversationList.map((conversation,index) => (
            <ConversationCard key={index} {...conversation} />
          ))}
        {conversationList.length == 0 && isEmpty && (
          <IllustrationContainer
            className="mt-20"
            description={ContentText.noConversationDesc}
            path="noConversation"
          />
        )}
      </section>
      <ProfileDropdown />
    </div>
  );
};

export default memo(ConversationList);
