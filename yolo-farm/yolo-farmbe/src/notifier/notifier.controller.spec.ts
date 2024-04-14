import { Test, TestingModule } from '@nestjs/testing';
import { NotifierController } from './notifier.controller';

describe('NotifierController', () => {
  let controller: NotifierController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotifierController],
    }).compile();

    controller = module.get<NotifierController>(NotifierController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
