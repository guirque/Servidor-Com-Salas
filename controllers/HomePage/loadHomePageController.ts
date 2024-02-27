import { Request as expressRequest, Response as expressResponse } from 'express';

export default function loadHomePage(req: expressRequest, res: expressResponse): void {
    res.status(200).sendFile(process.cwd() + '/view/index.html');
}