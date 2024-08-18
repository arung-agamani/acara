import { Test } from '@nestjs/testing';
import { EventService, SelectAcaraEvent } from './event.service';
import { AcaraEventController } from './event.controller';
import { drizzleProvider } from '../drizzle/drizzle.provider';

describe('EventController', () => {
  let eventService: EventService;
  let eventController: AcaraEventController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AcaraEventController],
      providers: [EventService, ...drizzleProvider],
    }).compile();

    eventService = moduleRef.get<EventService>(EventService);
    eventController = moduleRef.get<AcaraEventController>(AcaraEventController);
  });

  describe('get all events', () => {
    it('should return an array of events', async () => {
      const result: SelectAcaraEvent[] = [];
      jest
        .spyOn(eventService, 'getAllEvents')
        .mockImplementation(async () => result);
      expect((await eventController.findAll()).data).toBe(result);
    });
  });
});
