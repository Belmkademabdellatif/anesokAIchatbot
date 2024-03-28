import { db } from "@anesok/server/db"
import { TRPCError } from "@trpc/server"

export const getOneUser = async (userId:string) => {
    
    try{
        const user = await db.query.usersTable.findFirst({
            where: (users, { eq }) => eq(users.id, userId),
            columns:{
                id:true,
                name:true,
                workingStatus:true,
                relationShipStatus:true,
                bestFriendShortIntro:true,
            }
        })

        if(user == undefined){
            throw new TRPCError({code:'NOT_FOUND'})
        }

        return user

    }catch(err){
        console.log(err)
        throw new TRPCError({code:'INTERNAL_SERVER_ERROR'})
    }
}

export type OneUser = Awaited<ReturnType<typeof getOneUser>>