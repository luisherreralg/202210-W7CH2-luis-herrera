import { NextFunction, Request, Response } from 'express';
import { Thing } from '../interfaces/thing.js';
import importData from '../mock/data.json' assert { type: 'json' };
import fs from 'fs/promises';

// const importData = async () => {
//     const data = await fs.readFile('./data.json', 'utf-8');
//     return JSON.parse(data) as Thing[];
// };
// let data = await importData();

let data: Thing[] = importData.things;
const file = 'src/mock/data.json';

export class ThingController {
    getAll(req: Request, resp: Response) {
        resp.json(data);
        resp.end();
    }

    get(req: Request, resp: Response) {
        const id = Number(req.params.id);
        const thing = data.find((item) => item.id === id);
        if (thing) {
            resp.json(thing);
            resp.end();
        }
    }

    async post(req: Request, resp: Response) {
        const newThing: Thing = {
            ...req.body,
            id: data.length + 1,
        };
        data.push(newThing);
        await fs.writeFile(file, JSON.stringify({ things: data }));
        resp.json(newThing);
        resp.end();
    }

    async patch(req: Request, resp: Response, next: NextFunction) {
        const id = Number(req.params.id);
        const thing = data.find((item) => item.id === id);
        if (thing) {
            const index = data.indexOf(thing);
            data[index] = { ...thing, ...req.body };
            await fs.writeFile(file, JSON.stringify({ things: data }));
            resp.json(data[index]);
            resp.end();
        }
        next(new Error('Not found'));
        return;
    }

    async delete(req: Request, resp: Response, next: NextFunction) {
        if (!data.find((item) => item.id === +req.params.id)) {
            next(new Error('Not found'));
            return;
        }
        data = data.filter((item) => item.id !== +req.params.id);
        await fs.writeFile(file, JSON.stringify({ things: data }));
        resp.json({});
        resp.end;
    }
}
