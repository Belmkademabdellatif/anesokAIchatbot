import { Input } from "@anesok/components/ui/input";
import {
  SendMessageParams,
  sendMessageSchema,
} from "@anesok/server/module/message/message.schema";
import { api } from "@anesok/utils/api";
import { SendIcon } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parse } from "valibot";

// todo
// pass -1 for convesationId if there is not conversation exist
export default function MessageInput({
  userId,
  conversationId,
}: {
  userId: string;
  conversationId: number;
}) {
  const [message, setMessage] = useState<SendMessageParams>({
    userId,
    conversationId,
    content: "",
    isAI: false,
  });
  const [disable, setDisable] = useState(true);
  const { push } = useRouter();

  const { mutate: sendMessage, isLoading: isSendingMessage } =
    api.message.send.useMutation({
      onSuccess(data, variables, context) {
        // todo add message to zustand store
      },
    });

  const {
    mutate: creatingConversation,
    isLoading,
    isLoading: isCreatingConversation,
  } = api.conversation.create.useMutation({
    onSuccess(data) {
      // todo . . .
      // add message to zustand store before redirect

      // redirect to the new chat page
      push(`/chat/${data?.conversation.id}`);
    },
  });

  useEffect(() => {
    try {
      parse(sendMessageSchema, message);
      setDisable(false);
    } catch (err) {
      setDisable(true);
    }
  }, [message]);

  const handleClick = () =>
    conversationId == -1 ? creatingConversation(message) : sendMessage(message);

  return (
    <div className="h-[10%] p-2 px-4">
      <div className="relative">
        <SendIcon
          aria-disabled={disable || isSendingMessage || isCreatingConversation}
          onClick={handleClick}
          className="absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 hover:cursor-pointer hover:text-orange-300"
        />
        <Input
          value={message.content}
          onChange={(val) =>
            setMessage((prevs) => ({ ...prevs, content: val.target.value }))
          }
          className="border-orange-500 pe-10 focus-visible:ring-1 focus-visible:ring-orange-500"
        />
      </div>
    </div>
  );
}
