import { Request, Response } from 'express';
import { processAndSaveFeedback, getEmployeesWithReports } from '../services/report.service.js';
import {
<<<<<<< Updated upstream
  sendCreatedResult,
  sendErrorResult,
  sendBadRequestResult,
  sendNotFoundResult,
  HttpStatusCode
=======
    sendCreatedResult,
    sendErrorResult,
    sendBadRequestResult,
    sendNotFoundResult,
    sendSuccessResult,
    HttpStatusCode
>>>>>>> Stashed changes
} from '../utils/responseHandler.js';
import { PgError } from '../utils/dbErrors.js';

export const handleGetEmployeesWithReports = async (req: Request, res: Response) => {
    try {
        const data = await getEmployeesWithReports();
        return sendSuccessResult(res, data);
    } catch (error: any) {
        return sendErrorResult(res, error.message);
    }
};

export const handleIncomingFeedback = async (req: Request, res: Response) => {
  try {
    const { manager_id, text } = req.body;

  if (!text || text.trim() === '') {
     return sendBadRequestResult(res, "Feedback text is missing or empty");
 }

   const savedReport = await processAndSaveFeedback(manager_id, text);

   return sendCreatedResult(res, {
   message: "Report successfully processed and saved!",
   manager_id,
   savedReport
});
} catch (error: any) {
  console.error("Full Error Details:", error);
  const manager_id = req.body?.manager_id;

  if (error.message?.includes("was not found") || error.message?.includes("could not identify")) {
  return sendNotFoundResult(res, "Employee not found in the system");
}

    if (error.code === PgError.InvalidTextRepresentation || error.code === PgError.ForeignKeyViolation) {
        return sendBadRequestResult(res, "Invalid manager ID");
    }

    if (error.status === HttpStatusCode.SERVICE_UNAVAILABLE) {
        return sendErrorResult(res, "Analysis service is currently unavailable", HttpStatusCode.SERVICE_UNAVAILABLE, { manager_id });
    }

    return sendErrorResult(res, "Failed to save the report to the database.", HttpStatusCode.INTERNAL_SERVER_ERROR, { manager_id });
  }
};