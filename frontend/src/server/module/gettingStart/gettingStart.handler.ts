import { TRPCError } from "@trpc/server";
import { GettingStartParams } from "./gettingStart.schema";
import { db } from "@anesok/server/db";
import { usersTable } from "@anesok/schema";
import { eq } from "drizzle-orm";
import { clerkClient } from '@clerk/nextjs/server';


export const gettingStartHandler = async(params:GettingStartParams)=>{
    try{
        const {id,firstName,lastName,relationShipStatus,workingStatus,bestFriendShortIntro} = params
        
        await db.update(usersTable).set({
            name:`${firstName} ${lastName}`,
            relationShipStatus,
            workingStatus,
            bestFriendShortIntro
        }).where(eq(usersTable.id,id))

        // update the name at clerk   
        await clerkClient.users.updateUser(id, {firstName,lastName});
      
        return {code:200,message:'sucess'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}