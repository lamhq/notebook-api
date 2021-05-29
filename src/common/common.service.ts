import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { getMetadataStorage } from 'class-validator';
import { ValidationMetadata } from 'class-validator/types/metadata/ValidationMetadata';
import { MongoRepository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import numeral from 'numeral';
import { JwtService } from '@nestjs/jwt';
import { Counter, CodeType } from './counter.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Counter) private counterRepository: MongoRepository<Counter>,
    private jwtService: JwtService,
  ) {}

  hashPassword(value: string | number): Promise<string> {
    const saltRounds = 9;
    return bcrypt.hash(value, saltRounds);
  }

  comparePassword(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }

  /**
   * Remove validation rule of class-validator
   */
  /* eslint-disable @typescript-eslint/ban-types */
  removeValidationRule(targetConstructor: Function, propertyName: string, message: string): this {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mds = (getMetadataStorage() as any).validationMetadatas as ValidationMetadata[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (getMetadataStorage() as any).validationMetadatas = mds.filter((md: ValidationMetadata) => {
      const isRemove =
        md.target === targetConstructor &&
        md.propertyName === propertyName &&
        md.message === message;
      return !isRemove;
    });
    return this;
  }

  async generateCode(type = CodeType.Default, length = 5, prefix = ''): Promise<string> {
    const result = await this.counterRepository.findOneAndUpdate(
      { type },
      { $inc: { value: 1 } },
      { upsert: true, returnOriginal: false },
    );
    const counter = result.value;
    return `${prefix}${numeral(counter.value).format('0'.repeat(length))}`;
  }

  createToken(value: string, duration = '3days'): string {
    return this.jwtService.sign({ id: value }, { expiresIn: duration });
  }

  verifyToken(token: string): string {
    return this.jwtService.verify<{ id: string }>(token)?.id || '';
  }
}
