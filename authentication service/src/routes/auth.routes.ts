import { Router, Request, Response } from 'express';

const router = Router();

router.post('/verify-phone', (req: Request, res: Response) => {
    res.json({ message: "קיבלנו את הבקשה בנתיב ה-auth!" });
});

export default router;