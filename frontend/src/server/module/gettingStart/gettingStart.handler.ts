import { TRPCError } from "@trpc/server";
import { GettingStartParams } from "./gettingStart.schema";
import { db } from "@anesok/server/db";
import { usersTable } from "@anesok/schema";
import { eq } from "drizzle-orm";


export const gettingStartHandler = async(params:GettingStartParams)=>{
    try{
        const {email,firstName,lastName,relationShipStatus,workingStatus,bestFriendShortIntro} = params
        
        await db.update(usersTable).set({
            name:`${firstName} ${lastName}`,
            relationShipStatus,
            workingStatus,
            bestFriendShortIntro
        }).where(eq(usersTable.email,email))

        return {code:200,message:'sucess'}

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}