import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICidRepository } from '../contracts/cid.repository';
import { CidEntity } from '../entities/cid.entity';

@Injectable()
export class CidRepository implements ICidRepository {
  constructor(
    @InjectModel(CidEntity.name) private readonly model: Model<CidEntity>,
  ) {}
  async create(cid: Partial<CidEntity>, idUser: string): Promise<CidEntity> {
    const createdCid = new this.model({
      idUser: idUser,
      cid: cid.cid,
      description: cid.description,
    });
    return createdCid.save();
  }

  async findCidByCid(cid: string, idUser: string): Promise<CidEntity | null> {
    return this.model.findOne({ cid, idUser }).exec();
  }

  async findAllCids(idUser: string): Promise<CidEntity[]> {
    return this.model.find({ idUser }).exec();
  }
}
