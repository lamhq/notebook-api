import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectId } from 'mongodb';
import { CommonService } from 'src/common/common.service';
import { INPUT_ERROR, PASSWORD_NOT_MATCH } from 'src/common/constants/error';
import { ErrorResponse } from 'src/common/types/error-response';
import { MongoRepository } from 'typeorm';
import { ChangePasswordDto } from './account/dto/change-password.dto';
import { UpdateAdminAccountDto } from './account/dto/update-admin-account.dto';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin) private adminRepository: MongoRepository<Admin>,
    private readonly commonService: CommonService,
  ) {}

  async findOneByEmail(email: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne({ email });
  }

  async findOneByEmailOrFail(email: string): Promise<Admin> {
    try {
      const user = await this.adminRepository.findOneOrFail({ email });
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async findOneById(id: string): Promise<Admin | undefined> {
    return this.adminRepository.findOne(id);
  }

  async findOneByIdOrFail(id: string): Promise<Admin> {
    try {
      const user = await this.adminRepository.findOneOrFail(id);
      return user;
    } catch (error) {
      throw new NotFoundException();
    }
  }

  async changePassword(id: string, data: ChangePasswordDto): Promise<void> {
    const user = await this.adminRepository.findOne(id);
    if (!user) throw new NotFoundException();
    const isPwdValid = await this.commonService.comparePassword(
      data.currentPassword,
      user.password,
    );
    if (!isPwdValid) {
      const error: ErrorResponse = {
        error: INPUT_ERROR,
        details: { currentPassword: PASSWORD_NOT_MATCH },
        message: 'Invalid input',
      };

      throw new BadRequestException(error);
    }
    user.password = await this.commonService.hashPassword(data.newPassword);

    await this.adminRepository.updateOne({ _id: new ObjectId(id) }, { $set: user });
  }

  async updateAdminSetting(id: string, data: UpdateAdminAccountDto): Promise<void> {
    await this.findOneByIdOrFail(id);
    const updateDoc: Partial<Admin> = {
      displayName: data.displayName,
      description: data.description,
      gender: data.gender,
      country: data.country,
      avatar: data.avatar,
    };

    await this.adminRepository.updateOne({ _id: new ObjectId(id) }, { $set: updateDoc });
  }
}
