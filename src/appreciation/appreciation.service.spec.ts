import { Test, TestingModule } from '@nestjs/testing';
import { AppreciationService } from './appreciation.service';

describe('AppreciationService', () => {
  let service: AppreciationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppreciationService],
    }).compile();

    service = module.get<AppreciationService>(AppreciationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
