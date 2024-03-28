import { AlignJustifyIcon, X } from "lucide-react";
import { useConversationSheet } from "./conversation/ConversationSheet";
import { Button } from "@anesok/components/ui/button";

export default function Header() {
  const ContentText = {
    title: "انيسُك",
  };
  const { setShow, show } = useConversationSheet();
  return (
    <div className="h-[10%] w-full p-4 flex items-center gap-x-3">
      <Button className="flex sm:hidden items-center justify-center" variant={'ghost'} size={'icon'} onClick={() => setShow(!show)}>
        {show ? (
          <X className="text-slate-300" />
        ) : (
          <AlignJustifyIcon className="text-slate-300" />
        )}
      </Button>
      <h1 className="font-tajawal text-3xl font-bold text-primary">
        {ContentText.title}
      </h1>
    </div>
  );
}
