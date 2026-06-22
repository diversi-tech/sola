import { Request,Response } from "express"
import { syncAllActiveUsers, syncUserCalendar } from "../services/meeting.service.js"

export async function syncCalendar(req:Request,res:Response) {
    try {
        const bedgNumber = Number(req.params.userID)
        const refresh_token = req.body.refresh_token
        await syncUserCalendar(bedgNumber,refresh_token)
        res.json({message: "secseed"})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: 'error with calendar'})
    }
}

export async function syncActiveUsers(req:Request, res:Response) {
    try {
        await syncAllActiveUsers()
        res.json({message: "secseed"})
    } catch (error) {
          console.log(error); 

        res.status(500).json({message: "get all active users faild"})
    }
}