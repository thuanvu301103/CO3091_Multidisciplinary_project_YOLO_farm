import { Test, TestingModule } from '@nestjs/testing';
import { EnvsenseService } from './envsense.service';

describe('EnvsenseService', () => {
  let service: EnvsenseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnvsenseService],
    }).compile();

    service = module.get<EnvsenseService>(EnvsenseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
