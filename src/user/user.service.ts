import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create_user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HashingServiceProtocol } from '../auth/hash/hashing.service';
import { UpdateUserDto } from './dto/update_user.dto';
import { User } from 'generated/prisma';
import { USER_SELECT_FIELDS } from '../constants';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashing: HashingServiceProtocol,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: createUserDto.email,
      },
    });

    if (user?.id)
      throw new HttpException('Usuário já existe', HttpStatus.BAD_REQUEST);

    const passwordHash = await this.hashing.hash(createUserDto.password);

    const newUser = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        role: createUserDto.role,
        password_hash: passwordHash,
      },
      select: USER_SELECT_FIELDS,
    });

    return {
      user: newUser,
    };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.findUserById(id);

    const updateData: Partial<User> = {
      name: updateUserDto.name ?? user.name,
      email: updateUserDto.email ?? user.email,
      role: updateUserDto.role ?? user.role,
    };

    if (updateUserDto.password) {
      const passwordHash = await this.hashing.hash(updateUserDto.password);
      updateData.password_hash = passwordHash;
    }

    const userUpdate = await this.prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
      select: USER_SELECT_FIELDS,
    });

    return userUpdate;
  }

  private async findUserById(id: number): Promise<User> {
    try {
      return await this.prisma.user.findUniqueOrThrow({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException(
          `Usuário com ID ${id} não encontrado.`,
          HttpStatus.NOT_FOUND,
        );
      }

      throw error;
    }
  }
}
