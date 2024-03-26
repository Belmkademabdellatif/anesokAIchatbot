import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import {
  GettingStartParams,
  RelationStatus,
  gettingStartSchema,
  workingStatus,
} from "@anesok/server/module/gettingStart/gettingStart.schema";
import { parse } from "valibot";
import { api } from "@anesok/utils/api";
import { Input } from "@anesok/components/ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@anesok/components/ui/dropdown-menu";
import Loading from "../ui/loading";
import { SignOutButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";

const workingStatusDropdown:workingStatus[] =[
  'موظف',
  'عاطل عن العمل' ,
  'طالب'
]

const relationShipDropdown:RelationStatus[] = [
  'اعزب',
  'متزوج',
  'مطلق'
]

export default function GettingStartForm() {
  const {user} = useUser()
  const {push} = useRouter()
  const [form, setForm] = useState<GettingStartParams>({
    firstName: "",
    lastName: "",
    id: "",
    workingStatus: "طالب",
    relationShipStatus: "اعزب",
    bestFriendShortIntro: "",
  });
  const [disbaled, setDisabled] = useState(true);
  const { mutate, isLoading } = api.gettingStart.gettingFirst.useMutation({
    onSuccess(data) {
      if(data.code==200){
        void push('/chat')
      }
    },
  });
  const TextContent = {
    title: ["اهلاوسهلا في ", "انيسُك"],
    description: "رحلتك الشخصية تبدأ هنا!",
    firstNamePlaceholder: "الاسم الاول...",
    lastNamePlaceholder: "الاسم الاخير...",
    relationShipStatus: "الحالة الاجتماعية",
    workingStatus: "الحالة المهنية",
    friendIntro:
      "اخبرنا عن اقرب الاصدقاء اليك ، ما هي الهوايات المشتركة بينكم...",
    confirm: "تأكيد",
  };

  useEffect(() => {
    try {
      parse(gettingStartSchema, form);
      setDisabled(false);
    } catch {
      setDisabled(true);
    }
  }, [form]);

  useEffect(()=>{
    user && setForm(prevs=>({...prevs,id:user.id}))
  },[user])

  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6">
      <Card className="w-full max-w-lg space-y-6 p-4 py-10 text-center">
        <h1 className="font-tajawal text-3xl ">
          {TextContent.title[0]}{" "}
          <span className=" font-almarai font-bold text-primary">
            {TextContent.title[1]}
          </span>
        </h1>
        <p>{TextContent.description}</p>
        <Input
          value={form.firstName}
          onChange={(firstName) =>
            setForm((prevs) => ({
              ...prevs,
              firstName: firstName.target.value,
            }))
          }
          placeholder={TextContent.firstNamePlaceholder}
        />
        <Input
          value={form.lastName}
          onChange={(lastName) =>
            setForm((prevs) => ({ ...prevs, lastName: lastName.target.value }))
          }
          placeholder={TextContent.lastNamePlaceholder}
        />
        {/* <SignOutButton/> */}
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger className='w-full'>
            <Button className='w-full' variant={'outline'}>{form.relationShipStatus.length>0?form.relationShipStatus:TextContent.relationShipStatus}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{TextContent.relationShipStatus}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {relationShipDropdown.map(item=><DropdownMenuItem onClick={()=>setForm(prevs=>({...prevs,relationShipStatus:item}))} key={item}>{item}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu dir="rtl">
          <DropdownMenuTrigger className='w-full'>
            <Button className='w-full' variant={'outline'}>{form.workingStatus.length>0?form.workingStatus:TextContent.workingStatus}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{TextContent.workingStatus}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {workingStatusDropdown.map(item=><DropdownMenuItem onClick={()=>setForm(prevs=>({...prevs,workingStatus:item}))} key={item}>{item}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <Textarea
          value={form.bestFriendShortIntro}
          onChange={(intro) =>
            setForm((prevs) => ({
              ...prevs,
              bestFriendShortIntro: intro.target.value,
            }))
          }
          placeholder={TextContent.friendIntro}
        />
        <Button onClick={()=>mutate(form)} disabled={disbaled} className="w-full">
          {isLoading ? <Loading withText={true}/>:TextContent.confirm}
        </Button>
      </Card>
    </div>
  );
}
