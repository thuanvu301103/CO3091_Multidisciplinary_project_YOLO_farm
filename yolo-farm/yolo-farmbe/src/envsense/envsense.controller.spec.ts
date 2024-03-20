import { Test, TestingModule } from '@nestjs/testing';
import { EnvsenseController } from './envsense.controller';

describe('EnvsenseController', () => {
  let controller: EnvsenseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvsenseController],
    }).compile();

    controller = module.get<EnvsenseController>(EnvsenseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
