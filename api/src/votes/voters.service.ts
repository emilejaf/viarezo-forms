import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Voter } from './entities/voter.entity';
import { VoterDto } from './dto/voters.dto';

@Injectable()
export class VotersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(voteId: string): Promise<Voter[]> {
    const databaseVoters = await this.prisma.securedFormUser.findMany({
      where: {
        voteId: voteId,
      },
    });

    return databaseVoters.map((voter) => new Voter(voter));
  }

  async create(voteId: string): Promise<Voter> {
    const newVoter = await this.prisma.securedFormUser.create({
      data: {
        voteId: voteId,
      },
    });

    return new Voter(newVoter);
  }

  async update(voteId: string, voterId: number, voterDTO: VoterDto) {
    const updatedVoter = await this.prisma.securedFormUser.update({
      where: {
        voteId: voteId,
        id: voterId,
      },
      data: {
        email: voterDTO.email,
        firstName: voterDTO.firstName,
        lastName: voterDTO.lastName,
      },
    });

    return new Voter(updatedVoter);
  }

  async delete(voteId: string, voterId: number) {
    await this.prisma.securedFormUser.delete({
      where: {
        voteId: voteId,
        id: voterId,
      },
    });
  }
}
