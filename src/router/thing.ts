import { Router } from 'express';
import { ThingController } from '../controllers/things.js';

export const thingRouter = Router();

const controller = new ThingController();

thingRouter.get('/', controller.getAll);
thingRouter.get('/:id', controller.get);
thingRouter.post('/', controller.post);
thingRouter.patch('/:id', controller.patch);
thingRouter.delete('/:id', controller.delete);
