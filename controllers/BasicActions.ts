import * as express from 'express';
import path = require('path');

export function loadHomePage(req: express.Request, res: express.Response): void {
    res.status(200).sendFile(process.cwd() + '/view/index.html');
}